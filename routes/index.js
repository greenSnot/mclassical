var express = require('express');
var router = express.Router();
var nodegrass=require('nodegrass');
var iconv=require('iconv-lite');
var when=require('when');

var config=require('./config');
var search=require('./service');
var utils=require('../utils');

router.get('/',function(req,res){
  var json={
    pjax:false,
    language:config.languages[req.query.language]?(config.languages[req.query.language]?config.languages[req.query.language]:config.languages.cn):(config.serverName=='SZ'?config.languages.cn:config.languages.en),
    user_level:undefined,
    wechat_info:undefined,
    youku_client_id:config.youku.client_id};
  res.render('index', json);
});

router.get('/random',function(req,res){
  search.elastic_search_random(90).then(function(r){
    res.json({code:0,msg:'ok',data:r});
  })
})

router.get('/s/:type/:keyword',function(req,res){
  var type=req.params['type'];
  var keyword=req.params['keyword'];
  var json={
    pjax:{
      type:type,
      keyword:keyword
    },
    language:config.languages[req.query.language]?(config.languages[req.query.language]?config.languages[req.query.language]:config.languages.cn):(config.serverName=='SZ'?config.languages.cn:config.languages.en),
    user_level:undefined,
    wechat_info:undefined,
    youku_client_id:config.youku.client_id
  };
  res.render('index',json);
})

module.exports = router;
