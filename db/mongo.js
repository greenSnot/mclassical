var mongoose=require('mongoose');
var config=require('../config.js');

mongoose.connect('mongodb://localhost/mclassical',config.mongodb);
var con=mongoose.connection;
con.on('error',function(e){
		console.log('mongodb connect failed');
		console.log(e);
});
con.once('open',function(){
		console.log('mongodb connected');
});

