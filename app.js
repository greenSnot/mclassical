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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use('/',require('./routes/index'));
app.use('/search',require('./routes/search'));
app.use('/tools',require('./routes/tools'));

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
