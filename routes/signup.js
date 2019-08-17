const express = require('express');
const crypto = require('crypto');
const authUtils = require('../auth-utils');
const router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.authenticated == true)
    res.redirect('/index');

  res.render('signup', {title: 'Retro CTF', status: req.query.status });
});

router.post('/', async function(req, res, next) {
  if (req.body.password != req.body.confirmpassword) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Passwords are not identical')
    );
  }

  if (!authUtils.validateEmail(req.body.email)) {
    res.redirect(
      '/signup?status=' + encodeURIComponent('Invalid email')
    );
  }
});

module.exports = router;
