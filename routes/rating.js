var express = require('express');
var router = express.Router();
var utils=require('../utils');
var config=require('../config');
var db=require('../db/mongo_schema');
var when=require('when');

router.get('/',function(req,res){
    db.Users.findOne({
        _id:req.session.user
    }).then(function(u){
        if(!u){
            res.redirect('/');
            return;
        }
        var r={
            level:u.level?u.level:0,
            contributionValue:u.ratingTimes?u.ratingTimes:0,
            youku_client_id:config.youku.client_id,
            wechat_info:u.wechat
        };
        res.render('rating',r);
    });
});
router.post('/candidates',function(req,res){
    var ids;
    var show;
    try{
        ids=JSON.parse(req.body.ids);
        show=req.body.show?req.body.show:0;
        show=parseInt(show);
    }catch(e){
        res.json({code:-2,msg:'parse error'});
        return;
    }
    if(show==0){
        res.json({code:-1,msg:'?'});
        return;
    }
    console.log(ids);
    db.Users.findOne({
        _id:req.session.user
    }).then(function(u){
        if(u.level<1||Math.abs(show)>u.level){
            res.json({code:-1,msg:'permission denied'});
            return;
        }
        var ratingTimes=u.ratingTimes?u.ratingTimes:0;
        if(req.body.type=='audios'){
            db.Audios.update({
                id:{
                    '$in':ids
                },
                show:0
            },{
                '$set':{
                    show:show
                }
            },{
                multi:true
            }).then(function(r){

                db.Users.update({
                    _id:req.session.user
                },{
                    '$set':{
                        ratingTimes:ratingTimes+1
                    }
                }).then(function(u){
                    res.json({
                        code:0,
                        contribute_value:1,
                        msg:'ok'
                    });
                });
            });
        }else{
            res.json({code:-1,msg:'Coming soon~'});
            return;
        }
    });
});
router.get('/candidates',function(req,res){
    db.Users.findOne({
        _id:req.session.user
    }).then(function(u){
        if(u.level<1){
            res.json({code:-1,msg:'permission denied'});
            return;
        }
        if(req.query.type=='audios'){
            db.Audios.find({
                show:0
            }).limit(10).then(function(audios){
                res.json({
                    audios:audios,
                    code:0,
                    msg:'ok'
                });
            });
        }else{
            res.json({msg:'Coming soon',code:-1});
            return;
        }
    });
});

module.exports=router;
