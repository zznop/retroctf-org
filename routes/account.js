const express = require('express');
const crypto = require('crypto');
const authUtils = require('../auth-utils');
const router = express.Router();

/**
 * Handle get request for the user accounts page
 *
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/', async function(req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
    return;
  }

  const query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE id = $1', [req.session.uuid]
  );

  let username;
  let email;
  if (query.rows.length !== 0) {
    username = query.rows[0].username;
    email = query.rows[0].email;
  }

  res.render('account', {
    emailStatus: req.query.emailStatus,
    passwordStatus: req.query.passwordStatus,
    authenticated: req.session.authenticated,
    email: email,
    username: username,
  });
});

/**
 * Handle post request containing new password data
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.post('/newpass', async function(req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
    return;
  }

  if (req.body.newpassword.length < 8) {
    res.redirect(
      '/account?passwordStatus=' +
      encodeURIComponent('Password must contain atleast 8 characters')
    );
    return;
  }

  if (req.body.newpassword !== req.body.confirmpassword) {
    res.redirect(
      '/account?passwordStatus=' +
      encodeURIComponent('Confirmation password must match the new password!')
    );
  }

  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE id = $1', [req.session.uuid]
  );

  const currPassHash =
    crypto.createHash('sha256').update(req.body.currpassword).digest('hex');
  if (query.rows[0].password !== currPassHash) {
    res.redirect(
      '/account?passwordStatus=' + encodeURIComponent('Current password is incorrect')
    );
    return;
  }

  const newPassHash =
    crypto.createHash('sha256').update(req.body.newpassword).digest('hex');

  query = await req.app.get('pgcli').query(
    'UPDATE users SET password=$1 WHERE id=$2',
    [newPassHash, req.session.uuid],
  );

  res.redirect(
    '/account?passwordStatus=' + encodeURIComponent('Password updated successfully!')
  );
});

/**
 * Handle post request containing new email data
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.post('/newemail', async function(req, res) {
  if (authUtils.validateEmail(req.body.email) === false) {
    res.redirect(
      '/account?emailStatus=' + encodeURIComponent('Invalid email')
    );
    return;
  }

  if (authUtils.emailInUse(req.app.get('pgcli'), req.body.email) === true) {
    res.redirect(
      '/account?emailStatus=' + encodeURIComponent('Email already in use')
    );
    return;
  }

  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE id = $1', [req.session.uuid]
  );

  const hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  if (query.rows[0].password !== hash) {
    res.redirect(
      '/account?emailStatus=' + encodeURIComponent('Password is incorrect')
    );
    return;
  }

  // Insert the new email
  query = await req.app.get('pgcli').query(
    'UPDATE users SET email=$1 WHERE id=$2',
    [req.body.email.toLowerCase(), req.session.uuid],
  );

  res.redirect(
    '/account?emailStatus=' + encodeURIComponent('Email updated successfully!')
  );
});

/**
 * Handle account verification
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/verify/*', async function(req, res) {
  const urlArr = req.originalUrl.split('/');
  const uuid = urlArr[urlArr.length-1]

  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE id = $1',
    [uuid]
  );

  // Check if the verification request is valid
  if (query.rows.length === 0) {
    res.redirect(
      '/login?status=' + encodeURIComponent('Account does not exist')
    );
    return;
  }

  // Check if the account has been verified already
  if (query.rows[0].enabled === true) {
    res.redirect(
      '/login?status=' +
      encodeURIComponent('Account has already been verified')
    );
    return;
  }

  // Enable the account
  query = await req.app.get('pgcli').query(
    'UPDATE users SET enabled = \'true\' WHERE id = $1',
    [uuid]
  );

  // Redirect to login page
  res.redirect(
    '/login?status=' +
    encodeURIComponent('Account verified successfully! Please, sign in.')
  );
});

module.exports = router;
