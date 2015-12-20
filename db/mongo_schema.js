var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var audiosSchema= mongoose.Schema({
    id:{
        type:String,
        index:true,
        required: true,
        unique:true
    },
    song_id:{
        type:String,
        required: true
    },
    source:{
        type:String
    },
    song_name:{
        type:String
    },
    album_name:{
        type:String
    },
    player:{
        type:String
    },
    album_small:{
        type:String
    },
    album_big:{
        type:String
    },
    album_id:{
        type:String
    },
    show:{
        type:Number
    },
    album_link:{
        type:String
    },
    song_link:{
        type:String
    },
    url:{
        type:String,
        required: true
    }
},{
    _id:true,
    autoIndex:true
})
/*
var composersSchema= mongoose.Schema({
    name:{
        type:String,
        index:true,
        required: true,
        unique:true
    },
    introduction:{
        type:String
    },
    url:{
        type:String
    }
    works:[
        {
            name:{
                type:String,
                unique:true
            },
            sheet_url:String,
            instrument:String,
            form:String
        }
    ]
},{
    _id:true,
    autoIndex:true
})
*/
var usersSchema= mongoose.Schema({
    name:{
        type:String,
        index:true,
        required: true,
        unique:true
    },
    nickname:{
        type:String
    },
    password:{
        type:String,
        required: true
    },
    wechat:{
        openid: String,
        nickname: String,
        headimgurl: String,
        region: String,
        sex: Number,
        language: String,
        unionid:String,
        city: String,
        province: String,
        country: String
    },
    favorite_scores:[
        {
            media_id:String
        }
    ],
    favorite_videos:[
        {
            media_id:String
        }
    ],
    favorite_audios:[
        {
            media_id:String
        }
    ],
    level:Number,
    ratingTimes:Number,
    aliasesTimes:Number,
    blocksTimes:Number
},{
    _id:true,
    autoIndex:true
})



exports.Users = mongoose.model('Users', usersSchema);
exports.Audios= mongoose.model('Audios', audiosSchema);
//exports.Composers= mongoose.model('Composers', composersSchema);



