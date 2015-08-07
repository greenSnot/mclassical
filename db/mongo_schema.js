var mongoose=require('mongoose');

var kittySchema = mongoose.Schema({
    name: String
});
 
exports.Kitten = mongoose.model('Kitten', kittySchema);
