$.post('/wechat/jsapi',{url:location.href.split('#')[0]},function(result){
    wx.config({
                    debug: false,
                    appId: 'wxea9602a7f740bffe',
                    timestamp:result.timestamp,
                    nonceStr: result.noncestr,
                    signature: result.signature,
                    jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline']
                });
    wx.ready(function(){
	wechatSharing();
    });
    wx.error(function(res){
        alert('error');
        alert(JSON.stringify(res));
    });

    window.wechatSharing=function(config){
        if(!config){
            config={
                title: '古典音乐放大镜', // 分享标题
                link:location.href.split('#')[0],
		desc:'有趣又迷人的古典音乐搜索引擎',
                imgUrl:'http://static.mclassical.org/images/mclassical.jpeg',
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            }
        }
        wx.onMenuShareTimeline(config);
        wx.onMenuShareAppMessage(config);
    }
});
