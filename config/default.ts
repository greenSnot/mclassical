export const config = {
  youku: {
    client_id: '',
    client_secret: '',
    search_url: 'https://openapi.youku.com/v2/searches/video/by_keyword.json', // client_id,keyword
    videos_basic_url: 'https://openapi.youku.com/v2/videos/show_basic.json', // client_id,(video_id OR video_url)
  },
  google: {
    translate_url: 'https://www.googleapis.com/language/translate/v2?',
    //q=%E5%BE%88%E7%BE%8E%E5%A5%BD&target=en&key='
    search_url: 'https://www.googleapis.com/customsearch/v1?',
    api_key: '',
    search_engine_id: '',
  },
  typeorm_connection: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'chu',
    password: 'user_password',
    database: 'classical',
    synchronize: true,
    extra: {
      charset: 'utf8',
    },
    logging: false,
  },
  i18n: {
    search: '搜索',
    videos: '视频',
    scores: '乐谱',
    audios: '音频',
    more: '更多',
    lab: '实验室',
    lab_content: 'TODO',
    help: '帮助',
    help_content: 'email: kasichdand@gmail.com',
    about: '关于',
    about_content: '这是个充满热情的业余项目，目的是希望古典音乐更容易被获取。这不仅仅是数据的收集工作，还包含对历史数据的数字化的工作，如乐谱识别。',
    noResult: '未找到结果',
    musicWall: '音乐墙',
  },
  frontend_port: 8080,
  frontend_domain: 'http://mclassical.org',
  backend_port: 80,
  backend_domain: 'http://mclassical.org',
  cdn_prefix: '.',
  version: '1.0',
};
