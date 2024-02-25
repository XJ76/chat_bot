const mongoose = require('mongoose')

const customer = new mongoose.Schema({
    customerFirstName: {
        type: String,
        required: true
    },
    customerLastName: {
        type: String,
        required: true
    },
    customerGender: {
        type: String,
        required: true
    },
    customerAccountType: {
        type: String,
        required: true
    },
    customerIdNumber: {
        type: String,
        required: true
    },
    customerRegisteredBy: {
        type: String,
        required: true
    },
    customerDateofBirth: {
        type: String,
        required: true
    },
    customerPhoneNumber: {
        type: String,
        required: true
    },
    customerPinCode: {
        type: String,
        required: true
    },
    customerAccountStatus: {
        type: String,
        default: "active"
    },
    customerAccountVerified: {
        type: Boolean,
        default: false
    },
    customerBalance: {
        type: Number,
        default: 0.00
    },
    addedBy: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Customer', customer);