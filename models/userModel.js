const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userName: {type:String, required:true},
    email: {type:String, required:true},
    password: {type: String ,required: true},
    isAdmin: Boolean
});
const userModel = mongoose.model('user',schema);
module.exports = userModel;