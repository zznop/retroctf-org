const express = require('express');
const router = express.Router();

/* GET logout page */
router.get('/', function(req, res, next) {
  delete req.session.authenticated;
  res.redirect('/login');
});

module.exports = router;
