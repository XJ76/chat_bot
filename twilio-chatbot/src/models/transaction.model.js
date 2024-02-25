const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
  },
  agentPhoneNumber: {
    type: Number,
    required: false,
    default: "0"
  },
  transactionStatus: {
    type: String,
    required: false,
    default: "success"
  },
  transactionAmount: {
    type: Number,
    required: true,
  },
  transactionFrom: {
    type: String,
    required: true,
  },
  transactionTo: {
    type: String,
    required: true,
  },
  transactionTimestamp: {
    type: Date,
    default: Date.now, 
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);