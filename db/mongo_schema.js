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

var usersSchema= mongoose.Schema({
    name:{
        type:String,
        index:true,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    wechat:{
        openid: String,
        nickname: String,
        headimg: String,
        region: String,
        sex: Number,
        language: String,
        city: String,
        province: String,
        country: String
    },
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



