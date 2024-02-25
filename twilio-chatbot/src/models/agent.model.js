const mongoose = require('mongoose');

const agent = new mongoose.Schema({
    agentNumber: {
        type: String,
        required: true
    },
    agentName: {
        type: String,
        required: true
    },
    agentIdNumber: {
        type: String,
        required: true
    },
    agentAccountType: {
        type: String,
        required: true
    },
    agentCountry: {
        type: String,
        required: true
    },
    agentTownOrCity: {
        type: String,
        required: true
    },
    agentAddress: {
        type: String,
        required: true
    },
    agentBalance: {
        type: Number, 
        default: 0.00
    },
    agentPhoneNumber: {
        type: String,
        required: true
    },
    agentEmail: {
        type: String,
        required: true
    },
    // Following the schema where each property is prefixed witb 'agent'
    agentStatus: {
        type: String,
        required: false,
        default: "Active"
    },
    password: {
        type: String,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Agent', agent);