const express = require('express');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const authUtils = require('../auth-utils');
const router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.authenticated == true)
    res.redirect('/');

  res.render('signup', {
    title: 'Retro CTF',
    status: req.query.status,
    authenticated: req.session.authenticated
  });
});

router.post('/', async function(req, res, next) {
  if (req.body.password != req.body.confirmpassword) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Passwords are not identical')
    );
  }

  // ensure the email is valid
  if (!authUtils.validateEmail(req.body.email)) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Invalid email')
    );
  }

  // ensure the username is valid
  if (!authUtils.validateUsername(req.body.username)) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Invalid username')
    );
  }

  // ensure the password is long enough
  if (req.body.password.length < 12) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Password must contain atleast 12 characters')
    );
  }

  // ensure email isn't already in use
  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE email = $1', [req.body.email.toLowerCase()]
  );

  if (query.rows.length != 0) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Email already exists')
    );
  }

  // ensure username isn't already in use
  query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE username = $1', [req.body.username]
  );

  if (query.rows.length != 0) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Username already exists')
    );
  }

  // hash password and generate a UUID
  const hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  const uuid = uuidv4();

  // insert everything into the database
  query = await req.app.get('pgcli').query(
    'INSERT INTO users (id, username, email, password, role) ' +
    'VALUES ($1, $2, $3, $4, $5)',
    [
      uuid, req.body.username, req.body.email.toLowerCase(), hash, 0
    ]
  );

  req.session.authenticated = true;
  res.redirect('/');
});

module.exports = router;
