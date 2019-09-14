const express = require('express');
const router = express.Router();

/**
 * Handle get request to the home page
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/', function(req, res, next) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
  } else {
    res.render('index', {
      authenticated: req.session.authenticated,
    });
  }
});

module.exports = router;
