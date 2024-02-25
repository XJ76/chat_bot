const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => moment().add(5, 'minutes').toDate() // Adjust expiration time as needed
    }
});

module.exports = mongoose.model('Otp', otpSchema);