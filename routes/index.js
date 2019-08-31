const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.authenticated)
    res.redirect('/login');
  else
    res.render('index', {
      title: 'Retro CTF',
      authenticated: req.session.authenticated,
      is_admin: req.session.admin,
    });
});

module.exports = router;
