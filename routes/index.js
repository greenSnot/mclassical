var express = require('express');
var router = express.Router();
var db=require('../db/mongo_schema');
var nodegrass=require('nodegrass');
var iconv=require('iconv-lite');
var when=require('when');

var config=require('./config');
var search=require('./tools_helper');
var utils=require('../utils');

router.get('/',function(req,res){
    //防备案审核
    if(config.serverName=='SZ'&&utils.getPlatform(req).indexOf('pc')>=0){
        res.json({code:-9,msg:'请使用微信打开'});
        return;
    }

    var json={
        language:config.languages[req.query.language]?(config.languages[req.query.language]?config.languages[req.query.language]:config.languages.cn):(config.serverName=='SZ'?config.languages.cn:config.languages.en),
        user_level:undefined,
        wechat_info:undefined,
        youku_client_id:config.youku.client_id};
    if(req.session&&req.session.user&&req.session.user_type=='wechat'){
        db.Users.findOne({
            _id:req.session.user
        }).then(function(r){
            json.user_level=r.level;
            json.wechat_info=r.wechat;
            res.render('index',json);
        });
    }else{
        res.render('index',json);
    }
});

router.get('/random',function(req,res){
    search.elastic_search_random(90).then(function(r){
        res.json({code:0,msg:'ok',data:r});
    })
})

module.exports = router;
