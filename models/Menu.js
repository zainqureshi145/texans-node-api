const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: false
    },
    spice: {
        type: String,
        required: false
    },
    meat: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('menu', MenuSchema);