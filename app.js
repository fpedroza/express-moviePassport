const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

const indexRouter = require('./routes/index');
const config = require('./config');

//================= passport config ====================
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
//================= passport config ====================

const app = express();

app.use(helmet());

//================= passport config ====================
app.use(session({
  secret: 'some_salt',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GitHubStrategy(config,
  function(accessToken, refreshToken, profile, cb) {
    console.log("strategy callback:\n", profile);
    return cb(null, profile);
  }
));
passport.serializeUser((user, cb)=> {
  console.log("==== serialize:", user);
  cb(null, user);
});
passport.deserializeUser((user, cb)=> {
  console.log("==== deserialize:", user);
  cb(null, user);
});
//================= passport config ====================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=> {
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
