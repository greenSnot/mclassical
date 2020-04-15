exports.config = {
  youku: {
    client_id: 'a1a9e7a8905e91fb',
    client_secret: '0b798e851a23be5c315f0bc5fa7d9a61',
    search_url: 'https://openapi.youku.com/v2/searches/video/by_keyword.json', // client_id,keyword
    videos_basic_url: 'https://openapi.youku.com/v2/videos/show_basic.json', // client_id,(video_id OR video_url)
  },
  google: {
    translate_url: 'https://www.googleapis.com/language/translate/v2?',
    //q=%E5%BE%88%E7%BE%8E%E5%A5%BD&target=en&key='
    imslp_search_url: 'https://www.googleapis.com/customsearch/v1?',
    api_key: 'AIzaSyCOu26eZ6fObnqNgmOJ1LyUqx4xGrf618M',
    search_engine_id: '001951362915465840896:gpf1yjhkjoa',
  },
  frontend_port: 8080,
  frontend_domain: 'http://localhost',
  backend_domain: 'http://localhost',
  cdn_prefix: 'http://localhost:8080',
};
