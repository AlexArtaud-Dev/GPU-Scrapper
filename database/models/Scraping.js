const mongoose = require('mongoose');
require('dotenv').config();

const scrapingSchema = new mongoose.Schema({
    website: {
        type: String,
        required: true
    },
    processing: {
        type: Boolean,
        required: true,
        default: false
    },
    updatedAt: {
        type: Date,
        default: (Date.now())
    },
});

module.exports = mongoose.model('Scraping', scrapingSchema)