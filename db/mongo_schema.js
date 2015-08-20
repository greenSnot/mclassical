var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var usersSchema= mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    name: String,
    password: String,
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

var aliasesSchema= mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    keyword:String,
    aliases:[
        {
            user: {
                type:Schema.Types.ObjectID,
                ref:'Users'
            },
            name:String,
            type: String
        }
    ]
},{
    _id:true,
    autoIndex:true
});

var blocksSchema=mongoose.Schema({
    id:{
        type:String,
        require:true
    },
    keyword:String,
    blocks:[
        {
            name:String,
            type: String,
            user:{
                type:Schema.Types.ObjectID,
                ref:'Users'
            }
        }
    ]
},{
    _id:true,
    autoIndex:true
});

exports.Users = mongoose.model('Users', usersSchema);
exports.Blocks = mongoose.model('Blocks', blocksSchema);
exports.Aliases = mongoose.model('Aliases', aliasesSchema);
