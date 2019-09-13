const express = require('express');
const router = express.Router();

/**
 * Handle get request to logout page and destroy the session
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/', function(req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
    return;
  }

  delete req.session.authenticated;
  res.redirect('/login');
});

module.exports = router;
