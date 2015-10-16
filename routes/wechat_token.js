var config = require('../config').config;
var nodegrass = require('nodegrass');
var deadline = 0;
var access_token= 0;
var ticket_deadline= 0;
var jsapi_ticket= 0;

module.exports.checktoken=function(req,res,next){
    if(deadline-new Date().valueOf()<60*5*1000){
        var url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+config.wechat.app_id+"&secret="+config.wechat.app_secret;
        console.log(url);
        nodegrass.get(url,function(data,status,headers){
            console.log(data);
            var data=JSON.parse(data);
            deadline=data.expires_in*1000+new Date().valueOf();
            access_token=data.access_token;
            console.log("刷新token "+access_token);
            module.exports.deadline=deadline;
            module.exports.access_token=access_token;
            next();
        },'utf-8').on('error', function(e) {
            console.log("Got error: " + e.message);
            res.json({code:-1,msg:'unknown'});
        });
    }else{
        //console.log((deadline-new Date().valueOf())/1000+'s 刷新token');
        module.exports.deadline=deadline;
        module.exports.access_token=access_token;
        next();
    }
};

module.exports.checkticket=function(req,res,next){
    if(ticket_deadline-new Date().valueOf()<60*5*1000){
        nodegrass.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+access_token+"&type=jsapi",function(data,status,headers){
            var data=JSON.parse(data);
            ticket_deadline=data.expires_in*1000+new Date().valueOf();
            jsapi_ticket=data.ticket;
            console.log("刷新ticket "+jsapi_ticket);
            module.exports.ticket_deadline=ticket_deadline;
            module.exports.jsapi_ticket=jsapi_ticket;
            next();
        },'utf-8').on('error', function(e) {
            console.log("Got error: " + e.message);
            res.json({code:-1,msg:'unknown'});
        });
    }else{
        //console.log((ticket_deadline-new Date().valueOf())/1000+'s 刷新ticket');
        module.exports.ticket_deadline=ticket_deadline;
        module.exports.jsapi_ticket=jsapi_ticket;
        next();
    }
};

