const asyncErrorHandler = require("express-async-handler");
const Transaction = require("../../../models/transaction.model");

const fetchDeposits = asyncErrorHandler(async (req, res) => {
  try {
    // Query transactions where transactionType is 'deposit'
    const deposits = await Transaction.find({ transactionType: 'depositforcustomer' });
    
    res.json(deposits);
  } catch (error) {
    console.error("Error fetching deposits:", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

module.exports = fetchDeposits;
