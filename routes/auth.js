var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
//var db = require('./model');
var utils = require('../utils');
var config = require('../config').options;
var db=require('../db/mongo_schema');
var nodegrass = require('nodegrass');
var when=require('when');
var wechattoken = require('./wechattoken');

exports.loginFilter = function(req, res, next){
    var user = req.session.user;
    if (user){
            //正常流程
            //检查是否关注公众号
            if(req.session.user_type=='wechat'){
                console.log("已经登录 微信登录");
                next();
            }else{
                console.log("已经登录 未知");
                next();
            }
    } else {//登录校验失败
        console.log("未登录");

        ////是否微信浏览器打开
        if(req.headers['user-agent']&&req.headers['user-agent'].indexOf('MicroMessenger')>=0&&req.query!=undefined){
            var url=config.domain+req.originalUrl;

            //返回code
            if(req.query.state=='WECHAT_OAUTH_RESPONSE'&&req.query.code!=undefined){
                var code=req.query.code;
                //获取code token
                nodegrass.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid="+config.wechat.app_id+"&secret="+config.wechat.app_secret+"&code="+code+"&grant_type=authorization_code",function(data,status,headers){
                    console.log(data);
                    try{
                        data=JSON.parse(data);
                    } catch(e){
                        console.log("WECHAT ERROR");
                        res.json({code:-999,msg:'wechat error'});
                        return;
                    }

                    var access_token=data.access_token;
                    var openid=data.openid;
                    var unionid=data.unionid;
                    var refresh_token=data.refresh_token;
                    var expires_in=data.expires_in;

                    if(!openid){
                        url=url.replace('&redirect_uri=','&m_=');
                        url=url.replace('&code=','&m_=');
                        url=url.replace('&state=','&m_=');
                        res.writeHead(301, {'Location':'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.wechat.app_id+'&redirect_uri='+utils.urlencode(url)+'&response_type=code&scope=snsapi_userinfo&state=WECHAT_OAUTH_RESPONSE#wechat_redirect'});
                        res.end();
                        return;
                    }

                    //获取详细信息
                    nodegrass.get("https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openid+"&lang=zh_CN",function(data,status,headers){
                        console.log(data);
                        try{
                            data=JSON.parse(data);
                        } catch(e){
                            console.log("WECHAT ERROR");
                            res.json({code:-999,msg:'wechat error'});
                            return;
                        }
                        if(data.errcode){
                            console.log("https://api.weixin.qq.com/sns/userinfo?access_token="+access_token+"&openid="+openid+"&lang=zh_CN");
                            console.log("ERROR______________");
                            url=url.replace('&redirect_uri=','&m_=');
                            res.writeHead(301, {'Location':'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.wechat.app_id+'&redirect_uri='+utils.urlencode(url)+'&response_type=code&scope=snsapi_userinfo&state=WECHAT_OAUTH_RESPONSE#wechat_redirect'});
                            res.end();
                            return;
                        }

                        console.log("WECHATINFO ");
                        db.Users.findOne({
                            "wechat.openid":openid
                        }).then(function(u){
                            if(u){
                                req.session.user=u._id;
                                req.session.user_type='wechat';
                                next();
                                return;
                            }
                            db.Users.create({
                                wechat:data,
                                name:'jj',
                                aliasesTimes:0,
                                blocksTimes:0
                            }).then(function(r){

                                console.log("SAVE WECHAT");
                            });
                        });
                    });
                });
            }else{
                url=url.replace('&redirect_uri=','&m_=');
                res.writeHead(301, {'Location':'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.wechat.app_id+'&redirect_uri='+utils.urlencode(url)+'&response_type=code&scope=snsapi_userinfo&state=WECHAT_OAUTH_RESPONSE#wechat_redirect'});
                res.end();
                return;
            }

        //不是微信登陆
        }else{

            //未登录可直接访问的页面
            if (
                    req.path=='/'
               ){
                   next();
                   return;
               }

            //所有的ajax都要求有登录态
            if (req.headers["x-requested-with"] == "XMLHttpRequest") {
                res.json({
                    code: 10,
                    message: "Please login"
                });
                return;
            }

            res.json({msg:'Login',code:-1989});
        }
    }
};


