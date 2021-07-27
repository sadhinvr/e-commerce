const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {type: String, required: true},
    type: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    quantity: { type: String, required: true },
    picture : String
});

let productModel = mongoose.model('product', schema);
module.exports = productModel;