const express = require('express');
const crypto = require('crypto');
const authUtils = require('../auth-utils');
const router = express.Router();

router.get('/', async function(req, res, next) {
  if (req.session.authenticated != true) {
    res.redirect('/');
    return;
  }

  const query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE id = $1', [req.session.uuid]
  );

  let username = undefined;
  let email = undefined;
  if (query.rows.length != 0) {
    username = query.rows[0].username;
    email = query.rows[0].email;
  }

  res.render('account', {
    title: 'Retro CTF',
    emailStatus: req.query.emailStatus,
    passwordStatus: req.query.passwordStatus,
    authenticated: req.session.authenticated,
    isAdmin: req.session.admin,
    email: email,
    username: username,
  });
});

router.post('/newemail', async function(req, res, next) {
  if (authUtils.validateEmail(req.body.email) == false) {
    res.redirect(
      '/account?emailStatus=' + encodeURIComponent('Invalid email')
    );
    return;
  }

  if (authUtils.emailInUse(req.app.get('pgcli'), req.body.email) == true) {
    res.redirect(
      '/account?emailStatus=' + encodeURIComponent('Email already in use')
    );
    return;
  }

  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE id = $1', [req.session.uuid]
  );

  const hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  if (query.rows[0].password != hash) {
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

module.exports = router;
