var express = require('express');
var when=require('when');
var router = express.Router();
var utils=require('../utils');
var options=require('../config').options;
///Only for router tools/google_search
var google_search=function(keyword){
        var url=options.google.api.search_url+'q='+utils.urlencode(keyword)+'&cx='+options.google.api.search_engine_id+'&key='+options.google.api.api_key+'&fields=items(title,link)';
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

router.get('/google_translate',function(req,res){
        var keyword=req.query.keyword;
        var result={code:0};
        tools_helper.google_translate(keyword).then(function(data){
                result.result=data;
                res.json(result);
        });
});

module.exports=router;
