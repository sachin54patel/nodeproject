const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms');
var conn = mongoose.Collection;
var CategorySchema = new mongoose.Schema({
    category : {
        type: String,
        require: true,
        index:{
            unique:true,
        }
    },
    date : {
        type: Date,
        default: Date.now }

});

var categoryModel = mongoose.model('category',CategorySchema);
module.exports = categoryModel;