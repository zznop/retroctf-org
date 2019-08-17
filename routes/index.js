const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // Check authentication
  if (!req.session || !req.session.authenticated)
    res.redirect('/login');
  else
    res.render('index', { title: 'Retro CTF' });
});

module.exports = router;
