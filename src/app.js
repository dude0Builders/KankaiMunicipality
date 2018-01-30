var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

import { router } from './routes/index';
var users = require('./routes/users');
import mongoose from 'mongoose';
import webpack from 'webpack';
import config from './webpack.config.dev';
import mongoConn from './config/mongoCon';
import passport from 'passport';
import expressSanitizer from 'express-sanitizer';
import './config/passport';
import './models/userModel';
import './routes/userAPI';
import './routes/attendanceAPI';
import './routes/departmentAPI';
import './routes/tokenAPI';
import './routes/slidesAPI';
import pushServer from './notification/pushserver';
import session from 'express-session';
var connectMongo = require('connect-mongo')(session);
import uid from 'uid-safe';

var genuuid = function(){
  return uid.sync(18);
}

var app = express();

const compiler = webpack(config);
app.set(require('webpack-dev-middleware')(compiler,{
  noInfo:false,
  debug:true,
  publicPath: config.output.publicPath
 }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session implementation
app.use(session({
  store: new connectMongo({
    mongooseConnection:mongoose.connection,
    ttl:(5*60*60)

  }),
  secret:'kankai',
  saveUninitialized:true,
  resave:false,
  cookie:{
    path:"/",
    httpOnly:true,
    maxAge:5*60*1000,
  },
  name:"kankai-municipality",
  genid:function(req){
    return genuuid()
  }

}))


app.use('/', router);
app.use('/users', users);
app.use('*', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
mongoConn.createConn("localhost", 27017);
pushServer.startPushServer();

module.exports = app;


