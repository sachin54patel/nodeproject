const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:E7SCKKLbZosIfw4P@cluster0.mhm4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
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