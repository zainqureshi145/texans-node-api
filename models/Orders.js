const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu'
    },
    quantity: {
        type: String,
        required: false
    },
    instructions: {
        type: String,
        required: false
    },
    orderDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('order', OrderSchema);