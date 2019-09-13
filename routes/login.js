const express = require('express');
const crypto = require('crypto');
const authUtils = require('../auth-utils');
const router = express.Router();

/**
 * Handle get request to login page
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/', function(req, res) {
  res.render('login', {
    title: 'Retro CTF',
    status: req.query.status,
    authenticated: req.session.authenticated,
    isAdmin: req.session.admin,
  });
});

/**
 * Handle post request containing login data
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.post('/', async function(req, res) {
  if (!authUtils.validateEmail(req.body.email)) {
    res.redirect(
      '/login?status=' + encodeURIComponent('Invalid email')
    );
    return;
  }

  // query credentials from supplied email
  let query = await req.app.get('pgcli').query(
    'SELECT * FROM users WHERE email = $1', [String(req.body.email).toLowerCase()]
  );

  // redirect if the email doesn't exist
  if (query.rows.length === 0) {
    res.redirect(
      '/login?status=' + encodeURIComponent('Email does not exist')
    );
    return;
  }

  // hash the password and compare it
  let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  if (query.rows[0].password !== hash) {
    res.redirect('/login?status=' + encodeURIComponent('Incorrect password'));
    return;
  }

  req.session.authenticated = true;
  req.session.uuid = query.rows[0].id;
  if (query.rows[0].role === 1) {
    req.session.admin = true;
  } else {
    req.session.admin = false;
  }

  res.redirect('/');
});

module.exports = router;
