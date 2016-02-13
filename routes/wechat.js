var config = require('./config');
var express = require('express');
var router = express.Router();
var nodegrass = require('nodegrass');
var token = require('./wechat_token');
var sha1= require("../sha1");

router.post('/jsapi',function(req,res){
    if(!req.body.url){
        res.json({code:-9,msg:'error'});
        return;
    }
    var date=parseInt(new Date().valueOf()/1000);
    var noncestr='suteng';
    var signature=sha1.hex_sha1(
        'jsapi_ticket='+token.jsapi_ticket+
        '&noncestr='+noncestr+
        '&timestamp='+date+
        '&url='+req.body.url);
    res.json({
        timestamp:date,
        noncestr:noncestr,
        signature:signature
    });
});

module.exports= router;

