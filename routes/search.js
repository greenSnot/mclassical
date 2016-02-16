var express = require('express');
var router = express.Router();
var db=require('../db/mongo_schema');
var nodegrass=require('nodegrass');
var iconv=require('iconv-lite');
var when=require('when');

var config=require('./config');
var search=require('./tools_helper');
var utils=require('../utils');

//Search
router.post('/', function(req,res) {
	var keyword_origin=req.body.keyword;
	if(!keyword_origin||keyword_origin.length==0){
    	res.redirect('/');
    	return;
    }
    keyword_origin=keyword_origin.substr(0,120).toLowerCase();
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

        var audios_filter;
        if(req.body.audios_filter){
            audios_filter=req.body.audios_filter.split(',');
            var temp={};
            for(var i in audios_filter){
                temp[audios_filter[i]]=true;
            }
            audios_filter=temp;
        }
        
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
                    if(audios_filter){
                        if(audios_filter['qqmusic']){
                            qlist.push(search.QQMusic(i));
                            qlist_type.push('audios');
                        }
                        //if(audios_filter['neteasemusic']){
                        //    qlist.push(search.NeteaseMusic(i));
                        //    qlist_type.push('audios');
                        //}
                    }else{
                        qlist.push(search.QQMusic(i));
                        //qlist.push(search.NeteaseMusic(i));
                        //qlist_type.push('audios');
                        qlist_type.push('audios');
                    }
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
/////////////保证唯一性
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
                    console.log('audios '+datas[i].length);
                    for(var j in datas[i]){
                        if(!audios_ids[datas[i][j].id]){
                            audios_ids[datas[i][j].id]=true;
                            result.audios.push(datas[i][j]);
                        }
                    }
                }
			}

            if(req.body.type!='audios'){
                delete(result.audios);
            }
            if(req.body.type!='videos'){
                delete(result.videos);
            }
            if(req.body.type!='scores'){
                delete(result.scores);
            }

			res.json(result);
		})
	})
});

module.exports = router;
