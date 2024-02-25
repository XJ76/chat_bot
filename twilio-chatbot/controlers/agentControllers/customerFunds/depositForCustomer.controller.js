const asyncErrorHandler = require("express-async-handler");

// Import models and utils
const Customer = require("../../../models/customer.model");
const Agent = require("../../../models/agent.model");
const CreateATransactionRecord = require("../../../utils/createATransaction.util");

// deduct agent balance util
const deductAgentBalance = require("../../../utils/agentUtils/deductAgentBalance.util")

// increase customer balance util
const increaseCustomerBalance = require("../../../utils/customer/increaseCustomerBalance.util")

const depositForCustomer = asyncErrorHandler(async (req, res) => {
  const { customerPhoneNumber } = req.params;
  const { amount } = req.body;

  // Validate input
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid deposit amount" });
  }

  const customerExist = await Customer.findOne({ customerPhoneNumber });
  if (!customerExist) {
    return res.status(404).json({ error: `Customer with phone number ${customerPhoneNumber} does not exist.` });
  }

  const agentFound = await Agent.findOne({ /* query to find the agent */ });
  if (!agentFound) {
    return res.status(404).json({ error: "Agent not found." });
  }

  // Check agent balance and deduct if sufficient
  if (agentFound.agentBalance < amount) {
    return res.status(400).json({ error: "Agent account has insufficient balance to deposit for customer." });
  }

  try {
    // Update customer and agent balances in a transaction for consistency
    const updatedAgent = await deductAgentBalance(agentFound.agentNumber, amount);
    const updatedCustomer = await increaseCustomerBalance(customerPhoneNumber, amount);

    // Log the transaction
    await CreateATransactionRecord(
      "depositforcustomer",
      amount,
      agentFound.agentNumber,
      customerPhoneNumber
    );

    res.json({
      message: `Successfully deposited USD $${amount} for Customer Number ${updatedCustomer.customerPhoneNumber} account.`,
      newBalance: updatedCustomer.customerBalance
    });
  } catch (error) {
    console.error("Error depositing:", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

module.exports = depositForCustomer;