
var when=require('when');
var nodegrass=require('nodegrass');
var db=require('../db/mongo_schema');
var utils=require('../utils');
var exec = require('child_process').exec;
var config=require('../config');

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
    if(config.serverName!='HK'){
	    return when.promise(function(resolve,reject){
            var url=config.google.translate_url+'keyword='+utils.urlencode(source);
	    	getHtml(url).then(function(data){
	    		data=JSON.parse(data).result;
	    		resolve(data);
	    	});
	    });
    }else{
        // api
        return exports.google_translate_api(source);
    }
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
    if(config.serverName=='HK'){
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
                    for(var i in t){
r.push({});
			r[i].song_id=t[i].songId;
			r[i].id='neteasemusic_'+t[i].songId;
			r[i].song_name=t[i].songName;
			r[i].player=t[i].userName;
			r[i].album_name=t[i].albumName;
			r[i].url=t[i].songUrl;
			r[i].album_small=t[i].albumPic;
			r[i].album_big=t[i].albumPic;
                        r[i].source='NeteaseMusic';
			var model=new db.Audios(r[i]);
			model.pre('save',function(next){
				next();//忽略错误
			});
			qlist.push(
				model.save()
			);
                    }
console.log(t.length);
console.log('netease length');
when.all(qlist).then(function(){
                    resolve(r);
});
                }else{
                    resolve([]);
                }
            });
        });
    }
}
exports.QQMusic=function(keyword,page){
    if(config.serverName=='HK'){
        var url='http://'+config.servers.SZ+'/search';
	    return when.promise(function(resolve,reject){
            getHtml(url,{keyword:keyword,type:'audios',audios_filter:'qqmusic'}).then(function(data){
                data=JSON.parse(data);
                resolve(data.audios);
            });
        });
    }else{
console.log('qqmusic api');
        var url=exports.getQQMusicUrl(keyword,page);
	    return when.promise(function(resolve,reject){
            getHtml(url).then(function(data){
                data=JSON.parse(data);
                if(data.showapi_res_body&&data.showapi_res_body.pagebean&&data.showapi_res_body.pagebean.contentlist){
                    var t=data.showapi_res_body.pagebean.contentlist;
                    for(var i in t){
                        for(var j in t[i]){
                            if(j!='songid')
                            t[i][j]=utils.urldecode(t[i][j]);
                        }
                        //t[i].m4a="http://tsmusic24.tc.qq.com/"+t[i].songid+'.mp3';
                    }
		    var r=[];
		    var qlist=[];
                    for(var i in t){
r.push({});
			r[i].song_id=t[i].songid;
			r[i].id='qqmusic_'+t[i].songid;
			r[i].song_name=t[i].songname;
			r[i].player=t[i].singername;
			r[i].album_name=t[i].albumname;
			r[i].url=t[i].m4a;
			r[i].album_small=t[i].albumpic_small;
			r[i].album_big=t[i].albumpic_big;
                        r[i].source='QQMusic';

			var model=new db.Audios(r[i]);
			model.pre('save',function(next){
				next();//忽略错误
			});
			qlist.push(
				model.save()
			);
                    }
console.log(t.length);
console.log('qqmusic length');
			when.all(qlist).then(function(u){
                    resolve(r);
});
                }else{
                    resolve([]);
                }
            });
        });
    }
}

exports.Youku=function(keyword,page){
    if(config.serverName=='HK'){
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
    if(config.serverName=='HK'){
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

exports.getVideoSource=function(format,url){
	var result={code:0,msg:'ok'};
	return when.promise(function(resolve,reject){
		var cmdStr='python3 '+process.env.YOU_GET_PATH+"/you-get -u --format "+format+" '"+url+"'";
		exec(cmdStr,function(err,stdout,stderr){
			if(err){
				result.code=-1;
				if(stderr.indexOf('Invalid video format')>=0){
				result.msg='No such format for this video.';
				}else if(stderr.indexOf('Video not found')>=0){
					result.msg='Video not found';
				}else{
				 result.msg='Unknown error';
				}
				resolve(result);
				return;
			}
			var data=stdout.substr(0,stdout.length-1);
			var urls=data.split('URLs:\n');
			urls=urls[urls.length-1].split('\n');
			result.urls=urls;
			resolve(result);
		});
	});
};
