var express = require('express');
var router = express.Router();

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Retro CTF', status: req.query.status });
});


router.post('/', function(req, res, next) {
  if (!validateEmail(req.body.email)) {
    res.redirect('/login?status=' + encodeURIComponent('Invalid email'));
  }

  console.log(req.body.email);
  console.log(req.body.password);
});

module.exports = router;
