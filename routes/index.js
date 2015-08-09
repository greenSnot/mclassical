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
            // '吕思清',
            // '李传韵',
            // '宁峰',
             'akiko suwanai',
             'Midori Goto',
            //'黄蒙拉',
             'Henryk Wieniawski',
             'Julia Fischer',
             'Hilary Hahn',
             'Joseph Szigeti',
             'Vadim Repin', ///Violinist
             'chopin',
             'beethoven'
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
router.get('/search', function(req, res,next) {
	var keyword_origin=req.query.keyword;
	if(!keyword_origin||keyword_origin.length==0){
	res.redirect('/');
	return;
}
	var keyword=utils.before_translate_filter(keyword_origin);
	var result={code:0,msg:'ok',platform:utils.getPlatform(req)};
	search.google_translate(keyword).then(function(keyword_translated){
		keyword_translated=utils.after_translate_filter(keyword_translated);
console.log(keyword,keyword_translated);
		when.all([
				search.Youku(keyword),
				search.Youku(keyword_translated),
				search.Engine(keyword,'google'),
				search.Engine(keyword_translated,'google')
		]).then(function(datas){
			//youku
			result.youku=[];
			for(var i in datas[0]){
				result.youku.push(datas[0][i]);
			}
			for(var i in datas[1]){
				result.youku.push(datas[1][i]);
			}
			//imslp
			result.imslp=[];
			for(var i in datas[2]){
				result.imslp.push(datas[2][i]);
			}
			for(var i in datas[3]){
				result.imslp.push(datas[3][i]);
			}

			res.render('search', { title: 'Results' ,keyword:keyword_origin,result:result});
		})
	})
});

module.exports = router;
