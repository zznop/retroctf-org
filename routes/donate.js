const express = require('express');
const router = express.Router();

router.get('/', function(req, res, path) {
    res.render('donate', {
      title: 'Retro CTF',
      authenticated: req.session.authenticated,
      isAdmin: req.session.admin,
    });
});

module.exports = router;
