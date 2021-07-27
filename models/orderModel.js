const { string, date } = require('joi');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    quantity: Number
    
    
});

let orderModel = mongoose.model('order',schema);
module.exports = orderModel;