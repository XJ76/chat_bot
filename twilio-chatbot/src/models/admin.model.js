const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Admin', admin);