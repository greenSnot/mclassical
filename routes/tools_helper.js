
var when=require('when');
var nodegrass=require('nodegrass');
var utils=require('../utils');
var exec = require('child_process').exec;
var options=require('../config').options;

var getHtmls=utils.getHtmls;
var getHtml=utils.getHtml;

exports.google_translate_api=function(keyword,target){
        console.log('google_translate_api');
        target=target?target:'en';
        var url=options.google.api.translate_url+'q='+utils.urlencode(keyword)+'&source=zh-CN&target='+target+'&key='+options.google.api.api_key;
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
    if(options.server!='HK'){
	    return when.promise(function(resolve,reject){
            var url=options.google.translate_url+'keyword='+utils.urlencode(source);
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
		var url=options.baidu.translate_url+utils.urlencode(source)+'&client_id='+options.baidu.api_key;
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
		var url=options.separate2words.pullword_url+utils.urlencode(source);
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
	var url=options.separate2words.scws_url;
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

exports.getQQMusicUrl=function(keyword,page){
	var op={
		keyword:utils.urlencode(keyword),
		page:page?page:1,
		showapi_appid:options.showapi.app_id,
		showapi_timestamp:utils.timestamp(60000*5)
	};
	var sign=utils.hex_md5(utils.showapi_genstr(op)+options.showapi.app_secret);
	var url=options.qqmusic.search_url+'showapi_sign='+sign;

    op.keyword=utils.urlencode(op.keyword);
	for(var i in op){
		url+='&'+i+'='+op[i];
	}
    return url;
};

exports.QQMusic=function(keyword,page){
    if(options.server=='HK'){
        var url='http://'+options.servers.SZ+'/search';
	    return when.promise(function(resolve,reject){
            getHtml(url,{keyword:keyword,type:'audios'}).then(function(data){
                data=JSON.parse(data);
                resolve(data.audios);
            });
        });
    }else{
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
                        t[i].m4a="http://tsmusic24.tc.qq.com/"+t[i].songid+'.mp3';
                        t[i].source='QQmusic';
                    }
                    resolve(t);
                }else{
                    resolve([]);
                }
            });
        });
    }
}

exports.Youku=function(keyword,page){
    if(options.server=='HK'){
        var url='http://'+options.servers.SZ+'/search';
	    return when.promise(function(resolve,reject){
            getHtml(url,{keyword:keyword,type:'videos'}).then(function(data){
                data=JSON.parse(data);
                resolve(data.videos);
            });
        });
    }else{
        console.log('youku_api');
	    var url=options.youku.search_url+'?client_id='+options.youku.client_id+'&keyword='+utils.urlencode(keyword);
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
        var url=options.google.api.search_url+'q='+utils.urlencode(keyword)+'&cx='+options.google.api.search_engine_id+'&key='+options.google.api.api_key+'&fields=items(title,link)';
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
    if(options.server=='HK'){
        return exports.google_imslp_api(keyword);
    }else{
		return when.promise(function(resolve,reject){
			var url=options.google.search_url+'keyword='+utils.urlencode(keyword);
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
			var url=options.google.search_url+'keyword='+utils.urlencode(keyword);
			getHtml(url).then(function(data){
				data=JSON.parse(data).result;
				resolve(data);
			});
		});
	}
	var url=options.baidu.search_url+utils.urlencode('site:(imslp.org) '+'inurl:('+keyword+')');
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
