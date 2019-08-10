exports.config={
    serverDuty:{
        'wechat':false,
        'showapi':false,
        'youku_search':false,
        'imslp_search':false,
        'elastic_search':false,
        'google_translate':false
    },
    redis:{
        port: "6379",
        host: "127.0.0.1",
        pass:''
    },
    mongodb_url:'mongodb://127.0.0.1/mclassical',
	mongodb:{
		db:{
			native_parser:true
		},
		server:{
			pollSize:5,
			keepAlive:1
		},
		replset:{rs_name:'rs0'},
        user:'',
        pass:''
	},
    elastic_search:{
        url:'http://66.42.117.219:9200'
    },
	youku:{
		client_id:'',
		client_secret:'',
		search_url:'https://openapi.youku.com/v2/searches/video/by_keyword.json',// client_id,keyword
		videos_basic_url:'https://openapi.youku.com/v2/videos/show_basic.json',// client_id,(video_id OR video_url)
		videos_basic_multiply_url:'https://openapi.youku.com/v2/videos/show_basic_batch.json'// client_id,video_ids(STRING LIKE '2,3,4')
	},
	baidu:{
		search_url:'http://m.baidu.com/s?at=1&tn=iphone&pn=0&word=',//site:(imslp.org) inurl:(beethoven violin sonata 5)
		header:{
			Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding':'gzip, deflate, sdch',
			'Accept-Language':'zh-CN,zh;q=0.8,zh-TW;q=0.6',
			'Cache-Control':'no-cache',
			Connection:'keep-alive',
			Host:'m.baidu.com',
			Pragma:'no-cache',
			'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53'
		},
		translate_url:'http://openapi.baidu.com/public/2.0/bmt/translate?from=auto&to=auto&q=',
		api_key:'',
		secret_key:''
	},
	bing:{
		search_url:'http://cn.bing.com/search?q='//site:imslp.org beethoven
	},
	google:{
		translate_url:'',
		search_url:'',
		api:{
                	translate_url:'https://www.googleapis.com/language/translate/v2?',
                	//q=%E5%BE%88%E7%BE%8E%E5%A5%BD&target=en&key='
                	search_url:'https://www.googleapis.com/customsearch/v1?',
                	api_key:'',
                	search_engine_id:''
        	}
	},
	imslp:{
	},
	qqmusic:{
		search_url:'https://route.showapi.com/213-1?'
	},
	showapi:{
		app_secret:'',
		app_id:''
	},
	separate2words:{
		//pullword_url:'http://api.pullword.com/get.php?param1=0.7&param2=0&source=',
		pullword_url:'http://43.241.44.103:80/get.php?param1=0.9&param2=0&source=',
		showapi_url:'https://route.showapi.com/269-1?',
		sina_url:'http://segment.sae.sina.com.cn/urlclient.php',
		scws_url:'http://www.xunsearch.com/scws/api.php'
	},
	sina_api:{
		access_key:'',
		secret_key:''
	},
    languages:{
        en:{
            search:'Search',
            videos:'Videos',
            scores:'Scores',
            audios:'Audios',
            more:'More',
            volunteer:'Join volunteer',
            volunteer_content:'For more precise search results,we are trying to recruit following volunteers to refine our system'+
            '</br>A. Databases designing and search engine optimization.'+
            '</br>B. Scores recognition, from PDF to electronic music score format(like musicXML).'+
            '</br>C. Audios analysis, audios fingerprint and convert audios to electronic music scores.'+
            '</br>'+
            '</br>Contact: Mr.Calculon</br>0x00111111@gmail.com',
            help:'Help',
            help_content:'null',
            about_content:'The magnifier of classical music，non-commercial and free search engine of classical music。'+
'</br>We collected most of scores, videos, audios of classical music, for providing convenient search tool to musicans.'+
'</br>At the same time,we are working for classical music standardization(establish relationship with scores, audios, artists etc and build stardard format of classical music database).To make classical music easier to touch and share.',
            about:'About us',
            noResult:'No result',
            musicWall:'Music Wall',
            noLongerSupported:'Online Listening is no longer supported',
            busy:'Server is too busy,please try later'
        },
        cn:{
            search:'搜索',
            videos:'视频',
            scores:'乐谱',
            audios:'音频',
            more:'更多',
            volunteer:'加入志愿者',
            volunteer_content:
            '为了让放大镜搜索结果更精准，还有大量工作需要完成，主要是以下:'+
            '</br>A 数据库设计和搜索优化'+
	    '</br>B 图像(乐谱)的识别工作，扫描件转电子乐谱'+
	    '</br>C 音频方向的识别工作，音频转电子乐谱'+
	    '</br>D 乐理知识丰富的审核者，帮助审核机器经过识别并生成的乐谱'+
            '</br>'+
            '</br>感谢所有志愿者和音乐爱好者的支持'+
	    '</br>如果你也有野心和兴趣'+
            '</br>联系微信:drcalculon',
            help:'帮助',
            help_content:
            'Q1:为什么搜索不到曲子？'+
            '</br>A1:可能是以下原因之一:'+
            '</br>1)本搜索工具仅限于古典音乐并不包含近代作品和影视BGM及轻音乐'+
            '</br>2)如果关键字是中文英文以外的语言,这可能会产生不精准的搜索结果，建议使用中文或英文'+
            '</br>3)如果关键字太长，建议使用英文并以这种形式进行搜索，作曲家／演奏家＋作品号'+
            '</br>任何建议都欢迎来吐槽 微信:drcalculon'
            ,
            about:'关注公众号',
            about_content:
            '<img class="qrcode" src="images/qrcode.jpg">古典音乐放大镜(The magnifier of classical music)，非营利的古典音乐搜索工具。</br>我们汇集了大部分的古典音乐乐谱，视频，音频的资源。同时为实现古典音乐的信息标准化做努力（构建音频，乐谱，演奏家等信息的关系网和标准的存储格式），使得古典音乐的任何信息更容易获取和分享。'
            ,
            noResult:'未找到结果',
            musicWall:'音乐墙',
            noLongerSupported:'目前暂不支持在线试听',
            busy:'服务器现在有点忙,请稍后再试试看'
        }
    },
    servers:{
        SZ:'112.74.211.14',
        JP:'52.68.201.23',
        HK:'47.90.57.152',
    },
    wechat:{
        app_id:'',
        app_secret:''
    },
    neteasemusic:{
        search_url:'http://route.showapi.com/760-1?'
    },
    domain:'http://mclassical.org',
    version:'1.0'
}
