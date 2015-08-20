var mongoose=require('mongoose');
var options=require('../config.js').options;

mongoose.connect('mongodb://localhost/mclassical',options.mongodb);
var con=mongoose.connection;
con.on('error',function(e){
		console.log('mongodb connect failed');
		console.log(e);
});
con.once('open',function(){
		console.log('mongodb connected');
});

