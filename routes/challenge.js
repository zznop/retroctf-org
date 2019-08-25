const express = require('express');
const router = express.Router();

async function renderChallenge(req, res, path) {
  // TODO: get challenge information from the database
  console.log(req.originalUrl);
  res.render('challenge', {
    title: 'Retro CTF',
    challenge: 'Jump!',
    details: 'Cause inside-out is wiggity, wiggity, wiggity wack',
    authenticated: req.session.authenticated,
  });
}

router.get('/*', function(req, res, next) {
  if (!req.session || !req.session.authenticated)
    res.redirect('/login');
  else
    renderChallenge(req, res);
});

module.exports = router;
