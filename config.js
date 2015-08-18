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
		translate_url:'http://198.11.178.157:3000/tools/google_translate?',
		search_url:'http://198.11.178.157:3000/tools/google_search?',
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
	}
}
