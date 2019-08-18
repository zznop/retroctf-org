const express = require('express');
const crypto = require('crypto');
const authUtils = require('../auth-utils');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Retro CTF', status: req.query.status});
});

router.post('/', async function(req, res, next) {
  if (!authUtils.validateEmail(req.body.email)) {
    res.redirect(
      '/login?status=' + encodeURIComponent('Invalid email')
    );
  }

  // query credentials from supplied email
  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE email = $1', [String(req.body.email).toLowerCase()]
  );

  // redirect if the email doesn't exist
  if (query.rows.length == 0) {
    res.redirect(
      '/login?status=' + encodeURIComponent('Email does not exist')
    );
  }

  // hash the password and compare it
  let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  if (query.rows[0].password != hash) {
      res.redirect('/login?status=' + encodeURIComponent('Incorrect password'));
  }

  req.session.authenticated = true;
  res.redirect('/');
});

module.exports = router;
