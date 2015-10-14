var express = require('express');
var router = express.Router();
var utils=require('../utils');
var db=require('../db/mongo_schema');
var when=require('when');

//var test=new db.Users({
//    name:'wechatUser',
//    password:'none',
//    wechat:{
//        openid:'123asdf'
//    },
//    name:'sj5',
//    aliasesTimes:0,
//    blocksTimes:0
//});
//
//test.save(function(err){
//    if(err.errmsg)
//    console.log(err.errmsg);
//    console.log(err);
//
//  db.Users.findOne({
//      wechat:{
//          openid:'123asdf'
//      }
//  }).then(function(r){
//      console.log(r);
//  });
//});

//db.Users.remove({name:'23'}).then(function(data){});
    //db.Users.update({_id:'55d698f9593ebb4f45843b3e'},{$set:{name:'23'}}).then(function(data){
    //});
   // new db.Users({name:'25',password:'ff',wechat:{openid:'fsdfawef'}}).save(function(data){
   //     if(data.errmsg){
   //         console.log('error');
   //     }else{
   //         console.log('success');
   //     }
   // });

var addPreBlocks=function(blocks){
    var qlist=[];
    for(var i in blocks){
        qlist.push(
                db.PreBlocks.findOne({
                    keyword:blocks[i].keyword,
                    block:blocks[i].result
                }).exec()
            );
    }
    return when.all(qlist).then(function(datas){
        var map={};
        for(var i in datas){
            if(datas[i]){
                map[datas[i].keyword+"_"+datas[i].block]=true;
            }
        }
        var qlist=[];
        for(var i in blocks){
            if(!map[blocks[i].keyword+"_"+blocks[i].result]){
                qlist.push(
                  db.PreBlocks.create({
                               keyword:blocks[i].result,
                               block:blocks[i].keyword,
                               state:0,
                               creator:'55d6cc38bf966fff65ce2ad1'
                  })
                );
                qlist.push(
                  db.PreBlocks.create({
                               keyword:blocks[i].keyword,
                               block:blocks[i].result,
                               state:0,
                               creator:'55d6cc38bf966fff65ce2ad1'
                  })
                );
            }
        }
        return when.all(qlist)
    });
}
var addPreAliases=function(corrects){
    var qlist=[];
    for(var i in corrects){
        qlist.push(
                db.PreAliases.findOne({
                    keyword:corrects[i].keyword,
                    alias:corrects[i].result
                }).exec()
            );
    }

    return when.all(qlist).then(function(datas){
        var map={};
        for(var i in datas){
            if(datas[i]){
                map[datas[i].keyword+"_"+datas[i].alias]=true;
            }
        }
        var qlist=[];
        for(var i in corrects){
            if(!map[corrects[i].keyword+"_"+corrects[i].result]){
                qlist.push(
                  db.PreAliases.create({
                               keyword:corrects[i].result,
                               alias:corrects[i].keyword,
                               state:0,
                               creator:'55d6cc38bf966fff65ce2ad1'
                  })
                );
                qlist.push(
                  db.PreAliases.create({
                               keyword:corrects[i].keyword,
                               alias:corrects[i].result,
                               state:0,
                               creator:'55d6cc38bf966fff65ce2ad1'
                  })
                );
            }
        }
        return when.all(qlist);
    });
};

router.post('/',function(req,res){
    res.json({hehe:'f'});
});

function submit(datas){
    var corrects=[];
    var blocks=[];

    for(var i in datas){
        if(datas[i].correct){
            corrects.push(datas[i]);
        }else{
            blocks.push(datas[i]);
        }
    }

    var qlist=[];
    if(corrects){
        qlist.push(addPreAliases(corrects));
    }
    if(blocks){
        qlist.push(addPreBlocks(blocks));
    }
    when.all(qlist).then(function(){
        console.log('done');
    });
}

module.exports=router;
