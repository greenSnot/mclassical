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
        wx.checkJsApi({
            jsApiList:['onMenuShareAppMessage'],
            success:function(res){
                config.permission_wechat=true;
            }
        });
    });
    wx.error(function(res){
        alert('error');
        alert(JSON.stringify(res));
    });

    window.wechatSharing=function(config){
        if(!config){
            config={
                title: 'test', // 分享标题
                link:location.href.split('#')[0],
                imgUrl:'http://i.gtimg.cn/music/photo/mid_album_300/f/A/002stRua0aEvfA.jpg',
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
