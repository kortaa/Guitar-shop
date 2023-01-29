var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const userRouter = require('./routes/user-router');
const MongoStore = require('connect-mongo')(session);



var app = express();
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop');
require('./config/passport')

// view engine setup
app.engine('.hbs', expressHbs.engine({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
    {
      secret: 'ourlittlesecret',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({mongooseConnection: mongoose.connection}),
      cookie: {maxAge: 180 * 60 * 1000 } // -> 3hours

    }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use('/user', userRouter)
app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
