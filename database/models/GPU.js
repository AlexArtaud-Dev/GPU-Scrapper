const mongoose = require('mongoose');
require('dotenv').config();

const gpuSchema = new mongoose.Schema({
    website: {
        type: String,
        required: true

    },
    ref: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availability: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        default: (Date.now())
    },
});

module.exports = mongoose.model('GPU', gpuSchema)