const asyncErrorHandler = require("express-async-handler");

// import customer model
const Customer = require("../../../models/customer.model");

// import agent model
const Agent = require("../../../models/agent.model");

// import decrease and increase customer balances
const deductCustomerBalance = require("../../../utils/customer/deductCustomerBalance.utils")
const increaseAgentBalance = require("../../../utils/agentUtils/increaseAgentBalance.util")

const withdrawMoney = asyncErrorHandler(async (req, res) => {

    // get from req,body values
    const { agentNumber, amount } = req.body;

    // customer id from req
    const customerId = req.user.id;
    const customerFound = await Customer.findOne({ _id: customerId });
    const customerPhoneNumber = customerFound.customerPhoneNumber;

    // find agent
    const agentFound = await Agent.findOne({ agentNumber });

    if (!agentFound) {
        throw new Error(`Agent ${agentNumber} does not exist!`);
    }

    if (customerFound.customerBalance < amount) {
        throw new Error(`You have insufficient balance to withdraw.`);
    }

    // to the transaction - deduct from customer and also increase agent balance
    try {
        // decrease the balance for customer
        const updatedCustomer = await deductCustomerBalance( customerPhoneNumber, numericAmount )

        //   increase the balance for the agent
        const updatedAgent = await increaseAgentBalance(agentNumber, amount)

        // log the transaction
        await CreateATransactionRecord(
            "withdrawfromcustomer",
            amount,
            agentNumber,
            customerPhoneNumber
        );

        res.json(`Successfully withdrawn ${amount}. New Balance: ${updatedCustomer.customerBalance}`);

        // increase agent balance
    } catch (error) {
        throw new Error(error.message)
    }
})

module.exports = withdrawMoney