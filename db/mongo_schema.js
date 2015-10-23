var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var aliasesSchema= mongoose.Schema({
    keyword:{
        type:String,
        index:true,
        required: true,
        unique:true
    },
    aliases:[
        {
            creator: {
                type:Schema.Types.ObjectId,
                ref:'Users'
            },
            auditor:{
                type:Schema.Types.ObjectId,
                ref:'Users'
            },
            name:String
        }
    ]
},{
    _id:true,
    autoIndex:true
});

var pre_aliasesSchema= mongoose.Schema({
    keyword:String,
    alias:String,
    state:Number,
    creator: {
        type:Schema.Types.ObjectId,
        ref:'Users'
    }
},{
    _id:true,
    autoIndex:true
});

var blockforeverSchema= mongoose.Schema({
    keyword:{
        type:String,
        index:true,
        required: true,
        unique:true
    },
    level:Number,
    creator: {
        type : Schema.Types.ObjectId,
        ref:'Users'
    },
    auditor:{
        type:Schema.Types.ObjectId,
        ref:'Users'
    }
},{
    _id:true,
    autoIndex:true
});

var pre_blocksSchema = mongoose.Schema({
    keyword:String,
    block:String,
    state:Number,
    creator: {
        type:Schema.Types.ObjectId,
        ref:'Users'
    }
},{
    _id:true,
    autoIndex:true
});

var blocksSchema=mongoose.Schema({
    keyword:{
        type:String,
        index:true,
        required: true,
        unique:true
    },
    blocks:[
        {
            name:String,
            creator:{
                type:Schema.Types.ObjectId,
                ref:'Users'
            },
            auditor:{
                type:Schema.Types.ObjectId,
                ref:'Users'
            }
        }
    ]
},{
    _id:true,
    autoIndex:true
});


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
        type:String
    },
    link:{
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
    aliasesTimes:Number,
    blocksTimes:Number
},{
    _id:true,
    autoIndex:true
})



exports.Users = mongoose.model('Users', usersSchema);
exports.Blocks = mongoose.model('Blocks', blocksSchema);
exports.BlockForever = mongoose.model('BlockForever', blockforeverSchema);
exports.PreBlocks = mongoose.model('PreBlocks', pre_blocksSchema);
exports.Aliases = mongoose.model('Aliases', aliasesSchema);
exports.PreAliases = mongoose.model('PreAliases', pre_aliasesSchema);
exports.Audios= mongoose.model('Audios', audiosSchema);
exports.Composers= mongoose.model('Composers', composersSchema);



