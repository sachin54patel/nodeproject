const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms');
var conn = mongoose.Collection;
var UserSchema = new mongoose.Schema({
    username : {
        type: String,
        require: true,
        index:{
            unique:true,
        }
    },
    email : {
        type: String,
        require: true,
        index:{
            unique:true,
        }
    },
    password : {
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

var userModel = mongoose.model('users',UserSchema);
module.exports = userModel;