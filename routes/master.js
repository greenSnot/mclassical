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
        if(u.level<10){
            res.redirect('/');
            return;
        }
        res.render('master',{user_info:u});
    });
});
router.get('/users',function(req,res){
    var skip;
    try{
        skip=req.query.skip;
        skip=parseInt(skip);
        skip=skip?skip:0;
    }catch(e){
        res.json({code:-1,msg:'parse error'});
        return;
    }
    db.Users.findOne({
        _id:req.session.user
    }).then(function(u){
        if(u.level<10){
            res.redirect('/');
            return;
        }
        db.Users.find({
        }).skip(skip).limit(10).then(function(users){
            res.json({code:0,msg:'ok',users:users});
        });
    });
});
module.exports=router;
