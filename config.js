exports.options={
	mongodb:{
		db:{
			native_parser:true
		},
		server:{
			pollSize:5,
			keepAlive:1
		},
		replset:{rs_name:'myReplicaSetName'},
		user:'',
		pass:''
	},
	youku:{
		client_id:'a1a9e7a8905e91fb',
		client_secret:'0b798e851a23be5c315f0bc5fa7d9a61',
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
		api_key:'VW1I57TuLTZkswNnGaGR0MIS',
		secret_key:'GAowav3OME2MTvw6oQLSpfnT0vIrnCw6'
	},
	bing:{
		search_url:'http://cn.bing.com/search?q='//site:imslp.org beethoven
	},
	google:{
		translate_url:'http://118.193.172.214/tools/google_translate?',
		search_url:'http://118.193.172.214/tools/google_search?',
		api:{
                	translate_url:'https://www.googleapis.com/language/translate/v2?',
                	//q=%E5%BE%88%E7%BE%8E%E5%A5%BD&target=en&key='
                	search_url:'https://www.googleapis.com/customsearch/v1?',
                	api_key:'AIzaSyCOu26eZ6fObnqNgmOJ1LyUqx4xGrf618M',
                	search_engine_id:'001951362915465840896:gpf1yjhkjoa'
        	}
	},
	imslp:{
	},
	qqmusic:{
		search_url:'https://route.showapi.com/213-1?'
	},
	showapi:{
		app_secret:'053e38f060f34d36ae4db411ad005dcd',
		app_id:'4872'
	},
	separate2words:{
		//pullword_url:'http://api.pullword.com/get.php?param1=0.7&param2=0&source=',
		pullword_url:'http://43.241.44.103:80/get.php?param1=0.9&param2=0&source=',
		showapi_url:'https://route.showapi.com/269-1?',
		sina_url:'http://segment.sae.sina.com.cn/urlclient.php',
		scws_url:'http://www.xunsearch.com/scws/api.php'
	},
	sina_api:{
		access_key:'10xk15j1nj',
		secret_key:'zi1iy0m2hxml2i21kwll4wx3iw5j0h153lw1m4w5'
	},
    languages:{
        en:{
            search:'Search',
            videos:'Videos',
            scores:'Scores',
            audios:'Audios',
            more:'More',
            volunteer:'Join volunteer',
            volunteer_content:'Join volunteer',
            help:'Help',
            help_content:'Help',
            about:'About us',
            about_content:'About us',
            noResult:'No result',
            musicWall:'Music Wall',
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
            '为了让放大镜搜索结果更精准，更多音乐爱好者从中受益，需要以下志愿者帮忙来完善放大镜:'+
            '</br>A 审计员,负责筛选检索结果 去重复和不准确的结果 审核机器识别后的乐谱（扫描的乐谱手稿转换成的电子乐谱）'+
            '</br>B 外交翻译,负责与国外一些组织机构和唱片公司洽谈合作'+
            '</br>C 程序员,包括前端后端开发 机器学习 图像音频方向的模式识别 乐谱的识别'+
            '</br>D 负责微信公众号推广和招聘喜欢音乐的志愿者们'+
            '</br>E 美工交互设计和产品经理。'+
            '</br>'+
            '</br>不影响自己学习工作的前提下业余时间都可以帮忙'+
            '</br>感谢所有志愿者和音乐爱好者的支持'+
            '</br>联系微信:drcalculon',
            help:'帮助',
            help_content:
            'Help'
            ,
            about:'关于我们',
            about_content:
            '古典音乐放大镜(The magnifier of classical music)，免费的古典音乐搜索工具。</br>我们汇集了大部分的古典音乐乐谱，视频，音频的资源，给古典音乐爱好者们提供便捷的工具。同时为实现古典音乐的标准化做努力，使得古典音乐的任何信息更容易获取和分享。'
            ,
            noResult:'未找到结果',
            musicWall:'音乐墙',
            busy:'服务器现在有点忙,请稍后再试试看'
        }
    },
    servers:{
        HK:'118.193.172.214',
        SZ:'112.74.211.14',
        //USA:'198.11.178.157'
        JP:'52.68.201.23'
    },
    wechat:{
        app_id:'wxea9602a7f740bffe',
        app_secret:'bde088b2dbb0e36e513524f75fba7a53'
    },
    neteasemusic:{
        search_url:'http://route.showapi.com/760-1'
    },
    domain:'http://mclassical.org',
    version:'1.0'
}
