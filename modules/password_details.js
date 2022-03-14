const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms');
var conn = mongoose.Collection;
var CategoryPasswordSchema = new mongoose.Schema({
    password_category : {
        type: String,
        require: true,
        index:{
            unique:true,
        }
    },
    password_detail : {
        type: String,
        require: true,
    },
    date : {
        type: Date,
        default: Date.now }

});

var categoryModel = mongoose.model('password_details',CategoryPasswordSchema);
module.exports = categoryModel;