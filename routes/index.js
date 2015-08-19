var express = require('express');
var router = express.Router();
var db=require('../db/mongo_schema');
var nodegrass=require('nodegrass');
var iconv=require('iconv-lite');
var when=require('when');

var options=require('../config').options;
var search=require('./search_tools');
var utils=require('../utils');

router.get('/',function(req,res){

    var keys=[
             'Anne-Sophie Mutter',
             'Pinchas Zukerman',
             'Itzak Perlman',
             'Salvatore Accardo',
             'Leonid Kogan',
             'Arthur Grumiaux',
             'Yehudi Menuhin',
             'David Oistrakh',
             'Nathan Milstein',
             'Jascha Heifetz',
             'Fritz Kreisler',
             'Niccolo Paganini',
             //'吕思清',
             //'李传韵',
             //'宁峰',
             //'黄蒙拉',
             'akiko suwanai',
             'Midori Goto',
             'Henryk Wieniawski',
             'Julia Fischer',
             'Hilary Hahn',
             'Joseph Szigeti',
             'Vadim Repin', ///Violinists

             'Sergei Rachmaninoff',
             'Josef Hoffman',
             'Vladimir Horowitz',
             'Ludwig Van Beethoven',
             'Wolfgang Mozart',
             'Fredric Chopin',
             'Walter Wilhelm Gieseking',
             'Arturo Benedetti Michelangeli',
             'Emil Gilels',
             'Anton Rubinstein',
             'Hans von Bulow',
             'Georges Cziffra',
             'Maurizio Pollini',
             'Alfred Cortot',//Pianists

             'Franz Liszt'
            ];

    var urls=[];
    for(var i in keys){
        urls.push(search.getQQMusicUrl(keys[i]));
    }

    urls.sort(function(a,b){
        return Math.random()>.5 ? -1 : 1;
    });

	res.render('index',{QQMusicUrls:urls.splice(0,6)});
});
router.get('/get-source',function(req,res){
	var url=req.query.url;
	var format=req.query.format?req.query.format:'mp4';
	format=format=='mp4'||format=='flv'?format:'mp4';
	
	search.getVideoSource(format,url).then(function(result){
		res.json(result);
	});
});

/* GET home page. */
router.post('/search', function(req, res,next) {
	var keyword_origin=req.body.keyword;
	if(!keyword_origin||keyword_origin.length==0){
    	res.redirect('/');
    	return;
    }
	var keyword=utils.before_translate_filter(keyword_origin);
	var result={code:0,platform:utils.getPlatform(req),keyword:keyword_origin};
	search.google_translate(keyword).then(function(keyword_translated){
		keyword_translated=utils.after_translate_filter(keyword_translated);
        console.log(keyword,' translated:'+keyword_translated);

        qlist=[];
        qlist_type=[];
        if(req.body.type){
            if(req.body.type=='scores'){
                qlist.push(search.google_imslp(keyword));
                qlist.push(search.google_imslp(keyword_translated));
                qlist_type.push('scores');
                qlist_type.push('scores');
            }else if(req.body.type=='videos'){
                qlist.push(search.Youku(keyword));
                qlist.push(search.Youku(keyword_translated));
                qlist_type.push('videos');
                qlist_type.push('videos');
            }else if(req.body.type=='audios'){
                qlist.push(search.QQMusic(keyword));
                qlist.push(search.QQMusic(keyword_translated));
                qlist_type.push('audios');
                qlist_type.push('audios');
            }else{
                res.json({code:-2,msg:'type error'});
                return;
            }
        }else{
            res.json({code:-1,msg:'type is missing'});
            return;
        }
		when.all(qlist).then(function(datas){
			result.youku=[];
			result.imslp=[];
            result.qqmusic=[];
            var imslp_ids={};
            var youku_ids={};
            var qqmusic_ids={};
			for(var i in datas){
                if(qlist_type[i]=='scores'){
                    for(var j in datas[i]){
                        if(!imslp_ids[datas[i][j].link]){
                            imslp_ids[datas[i][j].link]=true;
                            result.imslp.push(datas[i][j]);
                        }
                    }
                }else if(qlist_type[i]=='videos'){
                    for(var j in datas[i]){
                        if(!youku_ids[datas[i][j].id]){
                            youku_ids[datas[i][j].id]=true;
                            result.youku.push(datas[i][j]);
                        }
                    }
                }else if(qlist_type[i]=='audios'){
                    for(var j in datas[i]){
                        if(!qqmusic_ids[datas[i][j].songid]){
                            qqmusic_ids[datas[i][j].songid]=true;
                            result.qqmusic.push(datas[i][j]);
                        }
                    }
                }
			}

			//res.render('search', { title: 'Results' ,keyword:keyword_origin,result:result});
			res.json(result);
		})
	})
});

module.exports = router;
