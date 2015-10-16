var express = require('express');
var when=require('when');
var router = express.Router();
var utils=require('../utils');
var config=require('../config');
///Only for router tools/google_search
var google_search=function(keyword){
        var url=config.google.api.search_url+'q='+utils.urlencode(keyword)+'&cx='+config.google.api.search_engine_id+'&key='+config.google.api.api_key+'&fields=items(title,link)';
        return when.promise(function(resolve,reject){
                utils.getHtml(url).then(function(data){
                        data=JSON.parse(data);
                        var result={code:0,result:[]};
                        if(data.error){
                                console.log(data);
                                result.code=-1;
                                result.msg='limited';
                        }
                        data=data.items;
                        for(var i in data){
                                result.result.push({
                                        title:data[i].title,
                                        link:data[i].link});
                        }
                        resolve(result);
                });
        });
}

router.get('/google_search',function(req,res){
        var keyword=req.query.keyword;
        var result={code:0};
        google_search(keyword).then(function(data){
                if(data.code!=0){
                        result.code=data.code;
                        result.msg=data.msg;
                }
                result.result=data.result;
                res.json(result);
        });
});

var google_translate=function(keyword,target){
        target=target?target:'en';
        var url=config.google.api.translate_url+'q='+utils.urlencode(keyword)+'&source=zh-CN&target='+target+'&key='+config.google.api.api_key;
        return when.promise(function(resolve,reject){
                utils.getHtml(url).then(function(data){
                        data=JSON.parse(data);
                        data=data.data.translations.length?data.data.translations[0].translatedText:'';
                        data=utils.htmldecode(utils.unicode2Chr(utils.urldecode(data)));
                        resolve(data);
                });
        });
}

router.get('/google_translate',function(req,res){
        var keyword=req.query.keyword;
        var result={code:0};
        google_translate(keyword).then(function(data){
                result.result=data;
                res.json(result);
        });
});

module.exports=router;
