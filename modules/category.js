const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://root:E7SCKKLbZosIfw4P@cluster0.mhm4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
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