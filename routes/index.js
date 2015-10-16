var express = require('express');
var router = express.Router();
var db=require('../db/mongo_schema');
var nodegrass=require('nodegrass');
var iconv=require('iconv-lite');
var when=require('when');

var config=require('../config').config;
var search=require('./tools_helper');
var utils=require('../utils');

router.get('/',function(req,res){
    if(utils.getPlatform(req).indexOf('pc')>=0){
        res.render('wiki',{});
        return;
    }

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
             '吕思清',
             '黄蒙拉',
             'akiko suwanai',
             'Midori Goto',
             'Henryk Wieniawski',
             'Julia Fischer',
             'Hilary Hahn',
             'Joseph Szigeti',

             'Ingolf Turban',
             'Denes Zsigmondy',
             'Volker Reinhold',
             'Vasko Vassilev',
             'Vadim Repin', ///Violinists

             'Sergei Rachmaninoff',
             'Josef Hoffman',
             'Vladimir Horowitz',
             'Ludwig Van Beethoven',
             'Wolfgang Mozart',
             'Fredric Chopin',
             'Arturo Benedetti Michelangeli',
             'Emil Gilels',
             'Anton Rubinstein',
             'Hans von Bulow',
             'Georges Cziffra',
             'Ignaz Friedman',
             'David Nadien',
             'Glenn Gould',
             'Julius Katchen',
             'Sviatoslav Richte',
             'Maurizio Pollini',
             'Alfred Cortot',//Pianists

             'Hollywood Orchestra',
             '杨雪霏',
             'Juliette Kang','Henry Doktorski','Chen Xingfu',
             'Bruno Walter','Elmar Oliveira','Peter Serkin','I Salonisti',
             'Vladimir Ashkenazy','Dubravka Tomsic','Joseph Cooper','Vladimir Ashkenazy','Shura Cherkassky','Daniela Ruso','Sviatoslav Richte','Benjamin Schmid','Cyprien Katsaris',
             'Kantorow','Kyung Wha Chung','Johannes Brahms','Tal & Groethuysen','Alexis Weissenberg','András Schiff','The Palm Court Orchestra',
             'Clara Haskil','Eric Hammerstein','Maria Barrientos','Ray Chen','Annette-Barbara Vogel','Natalia Walewska','Radu Lupu',
             '文薇','Rachel Barton Pine','Manuel Quiroga','Emanuel Vardi','Gidon Kremer','André Previn','Herbert Von Karajan',
             'Simone Dinnerstein','Angela Hewitt','Nigel Kennedy','Marcelle Meyer','Daniel Fuchs','Janine Johnson','Renaud','Leslie Howard','Julian Olevsky',
             'Bob Eberly','Geschwister buchberger','Rosa Ponselle','Vladimir Horowitz','Alfred Cortot','Gil Shaham','Göran Söllscher','Ivan Moravec','Marian Migdal','Levon Ambartsumian',
             'Frida Bauer','Andres Segovia','Mauro Giuliani','John Williams','Seiji Ozawa','Samson François',
             'Barbara Bonney','Fritz Wunderlich','Martha Argerich','Andres Alen','St. Martin\'s Orchestra','Barry Wordsworth','Bernard Haitink','Paul Coker','Neville Marriner','John Lenehan',

             'Franz Liszt'
            ];

    var urls=[];
    for(var i in keys){
        urls.push(search.getQQMusicUrl(keys[i]));
    }

    urls.sort(function(a,b){
        return Math.random()>.5 ? -1 : 1;
    });

	res.render('index',{QQMusicUrls:urls.splice(0,6),language:config.languages[req.query.language]?config.languages[req.query.language]:config.languages.cn,youku_client_id:config.youku.client_id});
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
module.exports = router;
