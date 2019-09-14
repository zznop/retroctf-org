const express = require('express');
const router = express.Router();

/**
 * Handle get request for the user accounts page
 *
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/', function(req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
    return;
  }

  res.render('donate', {
    authenticated: req.session.authenticated,
  });
});

module.exports = router;
