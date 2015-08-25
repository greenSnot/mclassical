var express = require('express');
var router = express.Router();
var db=require('../db/mongo_schema');
var nodegrass=require('nodegrass');
var iconv=require('iconv-lite');
var when=require('when');

var options=require('../config').options;
var search=require('./search_tools');
var utils=require('../utils');

//Search
router.post('/', function(req,res) {
	var keyword_origin=req.body.keyword;
	if(!keyword_origin||keyword_origin.length==0){
    	res.redirect('/');
    	return;
    }
    keyword_origin=utils.dbFilter(keyword_origin.substr(0,60).toLowerCase());
    keyword_origin=keyword_origin.trim();
	var keyword=utils.before_translate_filter(keyword_origin);
	var result={code:0,keyword:keyword_origin};
	search.google_translate(keyword).then(function(keyword_translated){
		keyword_translated=utils.after_translate_filter(keyword_translated);

        var keywords={};
        utils.after_translate_mix(keyword_origin,keywords);
        utils.after_translate_mix(keyword_translated,keywords);
        console.log(keywords);

        qlist=[];
        qlist_type=[];
        if(req.body.type){
            if(req.body.type=='scores'){
                for(var i in keywords){
                    qlist.push(search.google_imslp(i));
                    qlist_type.push('scores');
                }
            }else if(req.body.type=='videos'){
                for(var i in keywords){
                    qlist.push(search.Youku(i));
                    qlist_type.push('videos');
                }
            }else if(req.body.type=='audios'){
                for(var i in keywords){
                    qlist.push(search.QQMusic(i));
                    qlist_type.push('audios');
                }
            }else{
                res.json({code:-2,msg:'type error'});
                return;
            }
        }else{
            res.json({code:-1,msg:'type is missing'});
            return;
        }
		when.all(qlist).then(function(datas){
			result.videos=[];
			result.scores=[];
            result.audios=[];
            var scores_ids={};
            var videos_ids={};
            var audios_ids={};
			for(var i in datas){
                if(qlist_type[i]=='scores'){
                    for(var j in datas[i]){
                        if(!scores_ids[datas[i][j].link]){
                            scores_ids[datas[i][j].link]=true;
                            result.scores.push(datas[i][j]);
                        }
                    }
                }else if(qlist_type[i]=='videos'){
                    for(var j in datas[i]){
                        if(!videos_ids[datas[i][j].id]){
                            videos_ids[datas[i][j].id]=true;
                            result.videos.push(datas[i][j]);
                        }
                    }
                }else if(qlist_type[i]=='audios'){
                    for(var j in datas[i]){
                        if(!audios_ids[datas[i][j].songid]){
                            audios_ids[datas[i][j].songid]=true;
                            result.audios.push(datas[i][j]);
                        }
                    }
                }
			}
            if(result.audios.length==0){
                delete(result.audios);
            }
            if(result.videos.length==0){
                delete(result.videos);
            }
            if(result.scores.length==0){
                delete(result.scores);
            }

			res.json(result);
		})
	})
});

module.exports = router;
