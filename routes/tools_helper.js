var when=require('when');
var nodegrass=require('nodegrass');
var db=require('../db/mongo_schema');
var utils=require('../utils');
var exec = require('child_process').exec;
var config=require('./config');

var getHtmls=utils.getHtmls;
var getHtml=utils.getHtml;

exports.google_translate_api=function(keyword,target){
        console.log('google_translate_api');
        target=target?target:'en';
        var url=config.google.api.translate_url+'q='+utils.urlencode(keyword)+'&source=zh-CN&target='+target+'&key='+config.google.api.api_key;
        return when.promise(function(resolve,reject){
                getHtml(url).then(function(data){
                        data=JSON.parse(data);
                        data=data.data.translations.length?data.data.translations[0].translatedText:'';
                        data=utils.htmldecode(utils.unicode2Chr(utils.urldecode(data)));
                        resolve(data);
                });
        });
}

exports.google_translate=function(source){
    if(config.serverDuties.google_translate){
        // api
        return exports.google_translate_api(source);
    }else{
	    return when.promise(function(resolve,reject){
            var url=config.google.translate_url+'keyword='+utils.urlencode(source);
	    	getHtml(url).then(function(data){
	    		data=JSON.parse(data).result;
	    		resolve(data);
	    	});
	    });
    }
}

exports.elastic_search_random=function(size){
    var json={
        "size":size,
        "query": {
          "function_score" : {
            "query" : { "match_all": {} },
            "random_score" : {}
          }
        }
    };
    var url=config.elastic_search.url+'/scmd_audios/_search?source='+JSON.stringify(json);
	return when.promise(function(resolve,reject){
		getHtml(url).then(function(data){
			data=JSON.parse(data);
            data=data.hits.hits;
			resolve(data);
		});
	});
}

exports.elastic_search=function(keyword,type){
    var map={
        'scores':'scmd_composers',
        'audios':'scmd_audios'
    }

    var json={
        "size":20,
        "query": {
             "match":{
                 "_all":utils.urlencode(keyword)
             }
        }
    };
    
    var url=config.elastic_search.url+'/'+map[type]+'/_search?source='+JSON.stringify(json);
    console.log(url);
	return when.promise(function(resolve,reject){
		getHtml(url).then(function(data){
			data=JSON.parse(data);
            data=data.hits.hits;
			resolve(data);
		});
	});
}

exports.baidu_translate=function(source){
	return when.promise(function(resolve,reject){
		var url=config.baidu.translate_url+utils.urlencode(source)+'&client_id='+config.baidu.api_key;
		getHtml(url).then(function(data){
			data=JSON.parse(utils.unicode2Chr(data));
			var r=[];
			if(data.trans_result){
				for(var i in data.trans_result){
					r.push(data.trans_result[i].dst);
				}
			}else{
				resolve('');
			}
			resolve(r);
		});
	});
};

//中文分词
exports.separate2words_pullword=function(source){
	return when.promise(function(resolve,reject){
		var url=config.separate2words.pullword_url+utils.urlencode(source);
		getHtml(url).then(function(data){
			data=data.split('\r\n');
			var r=[];
			for(var i in data){
				if(data[i]&&data[i]!='error'){
					r.push(data[i]);
				}
			}
			resolve(r);
		});
	});
}

exports.separate2words_scws=function(source){
	var url=config.separate2words.scws_url;
	var data={
		data:source,
		respond:'json'
	};
	return when.promise(function(resolve,reject){
		getHtml(url,data).then(function(data){
			data=JSON.parse(utils.unicode2Chr(data));
			if(data.status!='ok'){
				resolve([]);
				return;
			}
			var words=[];
			for(var i in data.words){
				words.push(data.words[i].word);
			}
			resolve(words);
		});
	});
}

exports.getNeteaseMusicUrl=function(keyword,page){
	var op={
		key:'482dcc55534d629f559c4dd62f1d6a6e09bf61fc',
		limit:10,
		p:page?page:1,
		s:utils.urlencode(keyword),
		showapi_appid:config.showapi.app_id,
		showapi_timestamp:utils.timestamp(60000*5)
	};
	var sign=utils.hex_md5(utils.showapi_genstr(op)+config.showapi.app_secret);
	var url=config.neteasemusic.search_url+'showapi_sign='+sign;

    op.s=utils.urlencode(op.s);
	for(var i in op){
		url+='&'+i+'='+op[i];
	}
    return url;
};

exports.getQQMusicUrl=function(keyword,page){
	var op={
		keyword:utils.urlencode(keyword),
		page:page?page:1,
		showapi_appid:config.showapi.app_id,
		showapi_timestamp:utils.timestamp(60000*5)
	};
	var sign=utils.hex_md5(utils.showapi_genstr(op)+config.showapi.app_secret);
	var url=config.qqmusic.search_url+'showapi_sign='+sign;

    op.keyword=utils.urlencode(op.keyword);
	for(var i in op){
		url+='&'+i+'='+op[i];
	}
    return url;
};

exports.NeteaseMusic=function(keyword,page){
    if(!config.serverDuties.showapi){
        var url='http://'+config.servers.SZ+'/search';
	    return when.promise(function(resolve,reject){
            getHtml(url,{keyword:keyword,type:'audios',audios_filter:'neteasemusic'}).then(function(data){
                data=JSON.parse(data);
                resolve(data.audios);
            });
        });
    }else{
console.log('netease api');
        var url=exports.getNeteaseMusicUrl(keyword,page);
	    return when.promise(function(resolve,reject){
            getHtml(url).then(function(data){
                data=JSON.parse(data);
                if(data.showapi_res_code==0&&data.showapi_res_body&&data.showapi_res_body.data&&data.showapi_res_body.data.data&&data.showapi_res_body.data.data.list){
                    var t=data.showapi_res_body.data.data.list;
                    var r=[];
                    var qlist=[];
                    var ids=[];
                    for(var i in t){
                        r.push({});
                        r[i].song_id=t[i].songId;
                        r[i].show=0;
                        r[i].song_link='http://music.163.com/#/song?id='+r[i].song_id;
                        //r[i].album_link='http://music.163.com/#/album?id='+r[i].album_id;
                        r[i].id='neteasemusic_'+t[i].songId;
                        ids.push(r[i].id);
                        r[i].song_name=t[i].songName;
                        r[i].player=t[i].userName?t[i].userName:'N/A';
                        r[i].album_name=t[i].albumName?t[i].albumName:'N/A';
                        r[i].url=t[i].songUrl;
                        r[i].album_small=t[i].albumPic?t[i].albumPic:'N/A';
                        r[i].album_big=t[i].albumPic?t[i].albumPic:'N/A';
                        r[i].source='NeteaseMusic';
                        var model=new db.Audios(r[i]);
                        model.pre('save',function(next){
                            next();//忽略错误
                        });
                        //qlist.push(
                        //        model.save()
                        //        );
                    }
                    console.log(t.length);
                    console.log('netease length');
                    when.all(qlist).then(function(){
                        db.Audios.find({
                            id:{
                                '$in':ids
                            },
                            show:{
                                '$gte':0
                            }
                        }).then(function(audios){
                            resolve(audios);
                        });
                    });
                }else{
                    resolve([]);
                }
            });
        });
    }
}
exports.QQMusic=function(keyword,page){
    return when.promise(function(resolve,reject){
        exports.elastic_search(keyword,'audios').then(function(r){
            var data=[];
            for(var i in r){
                var t=r[i]
                data.push({
                    song_id:t._source.other_id.qqmusic_song_id,
                    id:'qqmusic_'+t._source.other_id.qqmusic_song_id,
                    show:0,
                    song_link:'http://y.qq.com/#type=song&mid='+t._source.other_id.qqmusic_song_mid,
                    album_link:'http://y.qq.com/#type=album&mid='+t._source.other_id.qqmusic_album_mid,
                    url:t._source.resource[0].url,
                    player:t._source.players[0].name.en||t._source.players[0].name.cn,
                    album_name:t._source.album_name.en||t._source.album_name.cn,
                    song_name:t._source.name.en||t._source.name.cn,
                    album_small:t._source.album_image,
                    album_big:t._source.album_image,
                    source:'QQMusic'
                })
            }
            resolve(data);
        })
    });
}

exports.Youku=function(keyword,page){
    if(!config.serverDuties.youku_search){
        var url='http://'+config.servers.SZ+'/search';
	    return when.promise(function(resolve,reject){
            getHtml(url,{keyword:keyword,type:'videos',videos_filter:'youku'}).then(function(data){
                data=JSON.parse(data);
                resolve(data.videos);
            });
        });
    }else{
        console.log('youku_api');
	    var url=config.youku.search_url+'?client_id='+config.youku.client_id+'&keyword='+utils.urlencode(keyword);
	    return getHtml(url).then(function(data){
	    	data=utils.unicode2Chr(data);
	    	var r=JSON.parse(data).videos;
            var result=[];
            for(var i in r){
                var t={};
                t.link=r[i].link;
                t.id=r[i].id;
                t.thumbnail=r[i].thumbnail;
                t.title=r[i].title;
                t.source='Youku';
                result.push(t);
            }
            return result;
	    });
    }
}

exports.google_imslp_api=function(keyword){
        console.log('google_imslp_api');
        var url=config.google.api.search_url+'q='+utils.urlencode(keyword)+'&cx='+config.google.api.search_engine_id+'&key='+config.google.api.api_key+'&fields=items(title,link)';
        return when.promise(function(resolve,reject){
                getHtml(url).then(function(data){
                        data=JSON.parse(data);
                        var result=[];
                        if(data.error){
                                console.log(data);
                                return [];
                        }
                        data=data.items;
                        for(var i in data){
                            var title=data[i].title;
                            var index=title.indexOf(' - IMSLP');
                            title=index>=0?title.substring(0,index):title;
                                result.push({
                                        title:title,
                                        link:data[i].link,
                                        source:'IMSLP'});
                        }
                        resolve(result);
                });
        });
}

exports.google_imslp=function(keyword){
    if(config.serverDuties.imslp_search){
        return exports.google_imslp_api(keyword);
    }else{
		return when.promise(function(resolve,reject){
			var url=config.google.search_url+'keyword='+utils.urlencode(keyword);
			getHtml(url).then(function(data){
				data=JSON.parse(data).result;
				resolve(data);
			});
		});
    }
};

exports.Engine=function(keyword,engine){
	if(engine=='google'){
		return when.promise(function(resolve,reject){
			var url=config.google.search_url+'keyword='+utils.urlencode(keyword);
			getHtml(url).then(function(data){
				data=JSON.parse(data).result;
				resolve(data);
			});
		});
	}
	var url=config.baidu.search_url+utils.urlencode('site:(imslp.org) '+'inurl:('+keyword+')');
	return getHtml(url).then(function(engine_data){
		engine_data=JSON.parse(engine_data);
		var engine_result=[];
		for(var i=1;i<11;++i){
			if(engine_data['Results_www_'+i]){
				var t=engine_data['Results_www_'+i];
				var index=engine_result.length-1;
		
				t=t.substr(t.indexOf('data-url')+10);
				t=t.substr(0,t.indexOf('<div class='));
				var spl=t.split('">');
				t={};
				t.url=utils.urldecode(spl[0]);
				t.title=spl[1].replace('<em>','').replace('</em>','');
				engine_result.push(t);
			}	
		}
		return engine_result;
	});
}
