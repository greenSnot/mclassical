
function waitFor(testFx, onReady, timeOutMillis) {
	//< Default Max Timout is 20s
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 20000,
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
				// If not time-out yet and condition not yet fulfilled
				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx());
			} else {
				if (!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					phantom.exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					// onReady: Do what it's supposed to do once the condition is fulfilled
					typeof(onReady) === "string" ? eval(onReady) : onReady();
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 250); //< repeat check every 250ms
};

var page = require('webpage').create();

var system = require('system');
var url='';
var filename='';
var start_page=1;
var end_pag=1;


if(system.args.length>1){
    url=system.args[1];
}

if(system.args.length>2){
    filename=system.args[2];
}

function genUrl(page){
    return 'http://sns.music.qq.com/fcgi-bin/albumlist/fcg_album_list.fcg?inter=0&lang=0&type=0&index=0&quality=0&sort=1&pagenum='+page+'&pagesize=30&otype=json&callback=MusicJsonCallback&_=0.8246259882580489&g_tk=938407465&loginUin=0&hostUin=0&format=jsonp&inCharset=GB2312&outCharset=utf-8&notice=0&platform=yqq&jsonpCallback=MusicJsonCallback&needNewCode=0';
}
/* set Cookie
console.log('setCookie:'+phantom.addCookie({
    name:'connect.sid',
    value:	's%3AIeMBIeYkv_nby6fafqYq8h5T14BG3OzW.ZkMQVWTIMgZAb0RPjxh%2B9Knu1jWit89A0yb2cUPsEvI',
    domain:	'wx.sz-sti.com',
    path:	'/',
    'send for':	'Any kind of connection',
    'accessible to script':	'No (HttpOnly)',
    created:	'Tuesday, November 24, 2015 at 10:12:19 AM',
    expires:	'Tuesday, December 1, 2015 at 10:12:19 AM'
}));
*/
/*
console.log('setCookie:'+phantom.addCookie({
    name:'detail',
    value:	'1437551414%2C2%2C%u97F3%u8F68%2C0%2C0%2C8%2C%2C%2C0%2C%2C%2C2015-10-31%2013%3A06%3A51%2C1%2C0%2C0%2C0%2C-5%2C-1%2C0',
    domain:	'.y.qq.com',
    path:	'/',
    'send for':	'Any kind of connection',
    'Accessible to script':'Yes',
    'accessible to script':	'No (HttpOnly)',
    created:	'Saturday, October 31, 2015 at 1:06:53 PM',
    expires:	'When the browsing session ends'
}));
*/


page.settings = {
  javascriptEnabled: true,
  loadImages: false,
  webSecurityEnabled: false,
  userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36 LBBROWSER'
  //要指定谷歌ua,我用火狐无法浏览
};
//page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36';

/*
page.onResourceRequested = function(requestData, request) {
        if ((/http:\/\/.+?\.css/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/css') {
            //request.abort();
        }else if((/.jpg/).test(requestData['url'])){
            //console.log(requestData['url']);
        }
};
page.onResourceReceived= function(respondData, respond,r,r2) {
    if((/fcg_album_list/).test(respondData['url'])){
        //console.log(respondData.url);
        //console.log(respond);
    }
}
*/

page.viewportSize = { width: 1024, height: 768 };
page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };

var fs=require('fs');

function onOpen(status){
    if (status !== 'success') {
        console.log('Unable to access network');
        phantom.exit();
    } 
    
    //page.render('shot.png');
    
    //page.injectJs("jquery.min.js")
    //var content=page.evaluate(function(){
    //    var content=$('#albumList').html();
    //    content=content.replace(/\"/g,'#"');
    //    return content;
    //})
    //
    
    var content=page.content;

    if(content.length<200){
        phantom.exit();
    }
    content=content.replace(/\<html\>\<head\>\<\/head\>\<body\>MusicJsonCallback\(/,'');
    content=content.replace(/\n\)<\/body\><\/html\>/,'');
    content=content.replace(/\"/g,'\\"');
    content=content.replace(/,\\"/g,',"');
    content=content.replace(/:\\"/g,':"');
    content=content.replace(/\\":/g,'":');
    content=content.replace(/{\\"/g,'{"');
    content=content.replace(/\\",/g,'",');
    content=content.replace(/\\"}/g,'"}');
    
    fs.write('qqmusic_albums/'+start_page+'.txt',content,'w');

    phantom.exit();
}

page.open(genUrl(start_page),onOpen);
