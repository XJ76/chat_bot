const asyncErrorHandler = require("express-async-handler")

// import customer model
const Customer = require("../../../models/customer.model")

// import agent model
const Agent = require("../../../models/agent.model");

// create a transaction util
const CreateATransactionRecord = require("../../../utils/createATransaction.util");

// increase agent balance util
const increaseAgentBalance = require("../../../utils/agentUtils/increaseAgentBalance.util")

// deduct customer balance util
const deductCustomerBalance = require("../../../utils/customer/deductCustomerBalance.utils")

const withdrawForCustomer = asyncErrorHandler(async (req, res) => {
    const { customerPhoneNumber } = req.params;
    const { amount } = req.body;

    const customerExist = await Customer.findOne({ customerPhoneNumber });
    // agent id
    //  const agentUserId = req.user.id;
    if (!customerExist) {
        res.status(404).json({ error: `Customer with phone number ${customerPhoneNumber} does not exist.` });
        return; // Return to prevent further execution
    }

    // Validate input 
    if (isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: "Invalid amount. Please enter a positive number." });
        return;
    }
    
    if (customerExist.customerBalance < amount) {
        const insufficientBalanceError = "Customer does not have enough balance to withdraw.";
        res.status(400).json({ error: insufficientBalanceError });
        return;
    }
    
    // check agent balance and it must be greater than amount
    const agentFound = await Agent.findById(agentUserId);

    // Update customer and agent balances in a transaction for consistency
    // increase the agent amount
    const updatedAgent = await increaseAgentBalance(agentFound.agentNumber, amount)

    // deduct the customer balance
    const updatedCustomer = await deductCustomerBalance(customerPhoneNumber, amount)

    // Log the transaction
    const transactionType = "withdrawforcustomer";
    const transactionAmount = amount;
    const transactionFrom = customerPhoneNumber;
    const transactionTo = agentFound.agentNumber;

    await CreateATransactionRecord(
        transactionType,
        transactionAmount,
        transactionFrom,
        transactionTo
    );

    res.json(`Successfully withdrawn USD $${amount} for Customer Number ${updatedCustomer.customerPhoneNumber} account. Customer New balance is USD $${updatedCustomer.customerBalance}`);
})

module.exports = withdrawForCustomer;