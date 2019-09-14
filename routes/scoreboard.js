const express = require('express');
const router = express.Router();

/**
 * Handle get request to render the scoreboard
 * 
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/', async function(req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
    return;
  }

  let query = await req.app.get('pgcli').query(
    'SELECT uid, count(*) as solvecnt FROM solves GROUP BY uid ORDER BY solvecnt desc'
  );

  let solves = query;
  for (let i = 0; i < solves.rows.length; i++) {
    query = await req.app.get('pgcli').query(
      'SELECT username FROM users WHERE id = $1',
      [solves.rows[i].uid]
    );

    solves.rows[i].rank = i + 1;
    solves.rows[i].uid = query.rows[0].username;
  }

  res.render('scoreboard', {
    authenticated: req.session.authenticated,
    solvers: solves.rows
  });
});

module.exports = router;
