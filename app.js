var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var saveRouter = require('./routes/save');

var app = express();


mongoose.connect('mongodb://jmuller3140:'+ process.env.MONGODB_PW +'@journal-cluster-shard-00-00-fhbmn.mongodb.net:27017,journal-cluster-shard-00-01-fhbmn.mongodb.net:27017,journal-cluster-shard-00-02-fhbmn.mongodb.net:27017/test?ssl=true&replicaSet=Journal-Cluster-shard-0&authSource=admin'
);

var optionsCB = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,authorization');
  next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});


app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', saveRouter);


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
