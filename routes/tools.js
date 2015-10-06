var express = require('express');
var when=require('when');
var router = express.Router();
var utils=require('../utils');
var options=require('../config').options;
var tools_helper=require('./tools_helper');

router.get('/google_search',function(req,res){
        var keyword=req.query.keyword;
        var result={code:0};
        tools_helper.google_search(keyword).then(function(data){
                if(data.code!=0){
                        result.code=data.code;
                        result.msg=data.msg;
                }
                result.result=data.result;
                res.json(result);
        });
});

router.get('/google_translate',function(req,res){
        var keyword=req.query.keyword;
        var result={code:0};
        tools_helper.google_translate(keyword).then(function(data){
                result.result=data;
                res.json(result);
        });
});

module.exports=router;
