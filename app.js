const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const pg = require('pg');
const favicon = require('serve-favicon');
const config = require('./config');

// Connect to database
const pgConString = 'postgres://' + config.db.user +
  ':' + config.db.secret + '@' + config.db.host +
  ':' + config.db.port + '/' + config.db.name;
const pgClient = new pg.Client(pgConString);
pgClient.connect();

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const signupRouter = require('./routes/signup');
const challengeRouter = require('./routes/challenge');
const accountRouter = require('./routes/account');
const donateRouter = require('./routes/donate');
const scoreboardRouter = require('./routes/scoreboard');

const app = express();
app.set('pgcli', pgClient);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: '8684911f-60f0-4bd2-8f59-5ea3190cc249',
  resave: false,
  saveUninitialized: false,
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/challenge', challengeRouter);
app.use('/account', accountRouter);
app.use('/donate', donateRouter);
app.use('/scoreboard', scoreboardRouter);

// serve the favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('404.jade');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
