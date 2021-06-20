var mongoose= require('mongoose');
var Schema= mongoose.Schema;
var cityschema= new Schema({
    city: {
        type: String,
        require: true
    }
},{ timestamps: true});

var Blog= mongoose.model('Blog', cityschema);
module.exports = Blog ;
