var express = require('express');
var router = express.Router();

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function queryHashByEmail(client, email) {
  var query = await client.query(
    'SELECT * FROM users WHERE email = $1', [email,]
  );

  if (query.rows.length == 0)
    return null;

  query.rows.forEach(row=>{
    console.log(row);
  });
}

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Retro CTF', status: req.query.status });
});

router.post('/', function(req, res, next) {
  // check that the email address is valid format
  if (!validateEmail(req.body.email))
    res.redirect('/login?status=' + encodeURIComponent('Invalid email'));

  // check that the email exists
  task = queryHashByEmail(req.app.get('pgcli'), req.body.email)
  if (task.WaitAndUnwrapException() == null)
    res.redirect('/login?status=' + encodeURIComponent('Email does not exist'));

  console.log(req.body.email);
  console.log(req.body.password);
});

module.exports = router;
