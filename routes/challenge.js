const express = require('express');
const router = express.Router();

/**
 * Determine if the logged in user has solved the challenge, or not
 * 
 * @param  {pg.Client} cli Postgres client object.
 * @param  {String}    uid User ID.
 * @param  {Integer}   cid Challenge ID.
 * @return {Boolean}   True if user solved the challenge, otherwise false.
 */
async function isSolved(cli, uid, cid) {
  const query = await cli.query(
    'SELECT * FROM solves WHERE uid = $1 and cid = $2',
    [uid, cid],
  );

  if (query.rows.length !== 0) {
    return true;
  }

  return false;
}

/**
 * Render the challenge page
 *
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
async function renderChallenge(req, res) {
  const urlArr = req.originalUrl.split('/');
  const route = urlArr[urlArr.length-1].split('?')[0];
  let query = await req.app.get('pgcli').query(
    'SELECT * FROM challenges WHERE route = $1',
    [route]
  );

  if (query.rows.length === 0) {
    res.status(404).render('404.jade');
    return;
  }

  let solved = await isSolved(
    req.app.get('pgcli'), req.session.uuid, query.rows[0].id
  );

  res.render('challenge', {
    title: 'Retro CTF',
    challenge: query.rows[0].challname,
    route: route,
    details: query.rows[0].longdescription,
    romname: query.rows[0].filename,
    solved: solved,
    authenticated: req.session.authenticated,
    errmsg: req.query.errmsg,
    isAdmin: req.session.admin,
  });
}

/**
 * Handle post request for a challenge flag submission
 *
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.post('/*', async function(req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
    return;
  }

  const urlArr = req.originalUrl.split('/');
  const route = urlArr[urlArr.length-1]
  let query = await req.app.get('pgcli').query(
    'SELECT * FROM challenges WHERE route = $1',
    [route]
  );

  if (!req.body.flag || (query.rows[0].flag !== req.body.flag.toLowerCase())) {
    res.redirect('/challenge/' + route + '?errmsg=' + encodeURIComponent('Nope.'));
    return;
  }

  query = await req.app.get('pgcli').query(
    'INSERT INTO solves (uid, cid) ' +
    'VALUES ($1, $2)',
    [req.session.uuid, query.rows[0].id],
  )

  res.redirect('/challenge/' + route);
});

/**
 * Handle get request and render a challenge page
 *
 * @param  {Request}  req  Client HTTP request.
 * @param  {Response} res  Server HTTP response.
 */
router.get('/*', function(req, res) {
  if (!req.session || !req.session.authenticated) {
    res.redirect('/login');
  } else {
    renderChallenge(req, res);
  }
});

module.exports = router;
