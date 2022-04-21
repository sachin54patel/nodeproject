const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://root:E7SCKKLbZosIfw4P@cluster0.mhm4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.connect('mongodb://localhost:27017/pms');

var conn = mongoose.Collection;
var CategoryPasswordSchema = new mongoose.Schema({
    password_category : {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
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