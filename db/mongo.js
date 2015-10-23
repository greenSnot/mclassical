var mongoose=require('mongoose');
var config=require('../config.js');

mongoose.connect(config.mongodb_url,config.mongodb);
var con=mongoose.connection;
con.on('error',function(e){
		console.log('mongodb connect failed');
		console.log(e);
});
con.once('open',function(){
		console.log('mongodb connected');
});

