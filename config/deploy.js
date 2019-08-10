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
      cn:{
          search:'搜索',
          videos:'视频',
          scores:'乐谱',
          audios:'音频',
          more:'更多',
          volunteer: '实验室',
          volunteer_content: 'TODO',
          help: '帮助',
          help_content:
          'email: kasichdand@gmail.com',
          about: '关于',
          about_content: '这是个充满野心与热情的业余项目，目的是希望古典音乐更容易被获取。这不仅仅是数据的收集工作，还包含对历史数据的数字化的工作（如乐谱识别）。',
          noResult:'未找到结果',
          musicWall:'音乐墙',
          noLongerSupported:'目前暂不支持在线试听',
          busy:'服务器现在有点忙,请稍后再试试看'
      }
  },
  servers:{
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
