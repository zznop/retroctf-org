const express = require('express');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const authUtils = require('../auth-utils');
const sendMail = require('../send-mail');
const router = express.Router();

/**
 * Handle get request to render the signup page
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/', function(req, res) {
  res.render('signup', {
    status: req.query.status,
    authenticated: req.session.authenticated,
  });
});

/**
 * Handle post request containing new account data
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.post('/', async function(req, res) {
  if (req.body.password !== req.body.confirmpassword) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Passwords are not identical')
    );
    return;
  }

  // ensure the email is valid
  if (!authUtils.validateEmail(req.body.email)) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Invalid email')
    );
    return;
  }

  // ensure the username is valid
  if (!authUtils.validateUsername(req.body.username)) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Invalid username')
    );
    return;
  }

  // ensure the password is long enough
  if (req.body.password.length < 8) {
    res.redirect(
      '/signup?status=' +
      encodeURIComponent('Password must contain atleast 8 characters')
    );
    return;
  }

  // ensure email isn't already in use
  if (authUtils.emailInUse(req.app.get('pgcli'), req.body.email) === true) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Email already in use')
    );
    return;
  }

  // ensure username isn't already in use
  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE username = $1', [req.body.username]
  );

  if (query.rows.length !== 0) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Username already exists')
    );
    return;
  }

  // hash password and generate a UUID
  const hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  const uuid = uuidv4();

  // insert everything into the database
  query = await req.app.get('pgcli').query(
    'INSERT INTO users (id, username, email, password, role, enabled) ' +
    'VALUES ($1, $2, $3, $4, $5, $6)',
    [
      uuid, req.body.username, req.body.email.toLowerCase(),
      hash, 0, 'false'
    ]
  );

  sendMail.sendVerificationEmail(req.body.email.toLowerCase(), uuid, res);
});

module.exports = router;
