#!/usr/bin/env node
var express = require('express');
var fs= require('fs');
var app = express();
var path = require('path');

var local_path='./resources_zips/';

function getClientIp(req) {
    var unknown='6.6.6.6';
        return req.headers['x-forwarded-for'] ||
        (req.connection?req.connection.remoteAddress:unknown) ||
        (req.socket?req.socket.remoteAddress:unknown) ||
        (req.connection.socket?req.connection.socket.remoteAddress:unknown)||unknown;
};

app.set('port', process.env.PORT || 9000);
app.use(function(req,res,next){
    console.log(getClientIp(req));
    next();
});
app.use(express.static(path.join(__dirname, local_path)));
var router=express.Router();
router.post('/',function(req,res){
	if(req.query['rm']){
		fs.unlinkSync(local_path+req.query['rm']);
		res.write('rm ok');
	}else if(req.query['ls']){
		var files=fs.readdirSync(local_path);
		for(var i =0;i<files.length;++i){
			res.write(parseInt(fs.lstatSync(local_path+files[i]).size/1000)+' '+files[i]+'\n');
		}
	}
res.end()
});
app.use('/',router);
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


var server = app.listen(app.get('port'), function() {
console.log('running')
});
