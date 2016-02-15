var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require("underscore");
var app = express();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var compression= require('compression');
var config=require('./routes/config');

// connect mongodb
require('./db/mongo.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
    resave: false,
    saveUninitialized: true,
    store: new RedisStore(config.redis),
    rolling: true,
    secret: 'mclassical_login',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));//session setup

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var response = express.response,
    _render = response.render;
response.render = function (view, options, callback) {
    options = options || {};
    _.extend(options, {
            version:config.version,
            serverDate:new Date().valueOf()
    });
    _render.call(this, view, options, callback);
};

if(config.serverDuties.wechat){
    app.use(require('./routes/wechat_token').checktoken);
    app.use(require('./routes/wechat_token').checkticket);
    app.use('/wechat',require('./routes/wechat'));
}
app.use(require('./routes/auth').loginFilter);
app.use('/',require('./routes/index'));
app.use('/search',require('./routes/search'));
//app.use('/rating',require('./routes/rating'));
app.use('/tools',require('./routes/tools'));
app.use('/master',require('./routes/master'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
	console.log(err.message);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
console.log(err.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
