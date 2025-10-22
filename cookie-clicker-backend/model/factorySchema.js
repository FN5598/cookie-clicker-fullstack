const mongoose = require('mongoose');

const factorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    factoryLore: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Factory', factorySchema);