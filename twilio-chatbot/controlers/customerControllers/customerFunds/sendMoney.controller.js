const asyncErrorHandler = require("express-async-handler");

// import customer model
const Customer = require("../../../models/customer.model");

// import the transaction util
const CreateATransactionRecord = require("../../../utils/createATransaction.util")

// import decrease and increase customer balances
const deductCustomerBalance = require("../../../utils/customer/deductCustomerBalance.utils")
const increaseCustomerBalance = require("../../../utils/customer/increaseCustomerBalance.util")

const sendMoney = asyncErrorHandler(async (req, res) => {
    // req.user to get sender id
    const senderId = req.user.id

    // get receiverPhoneNumber from req.body.sendTo
    const { sendToPhoneNumber, amount } = req.body;

    // check if sender has enough balance
    const senderFound = await Customer.findOne({ _id: senderId });

    if ( sendToPhoneNumber === senderFound.customerPhoneNumber ){}

    // if amount is smaller than 5 throw error
    if (amount < 2) {
        throw new Error("You cannot send money lower than USD $1")
    }

    if (senderFound.customerBalance < amount) {
        throw new Error("Insufficient balance")
    }

    // check if receiverNumber exists
    const receiverFound = await Customer.findOne({ customerPhoneNumber: sendToPhoneNumber });

    if (!receiverFound) {
        throw new Error("The number you want to send money to is not registered.")
    }

    // update balances
    try {
        const senderPhoneNumber = senderFound.customerPhoneNumber;
        const receiverPhoneNumber = receiverFound.customerPhoneNumber;
        const numericAmount = Number(amount)

        // update sender balance
        const updatedSender = await deductCustomerBalance(senderPhoneNumber, numericAmount)

        // increase the receiver balance
        const updatedReceiver = await increaseCustomerBalance(receiverPhoneNumber, numericAmount)

        // log the transaction
        await CreateATransactionRecord(
            "sendmoney",
            amount,
            senderPhoneNumber,
            receiverPhoneNumber
        );
        
        res.json(`Successfully send ${amount} to ${receiverPhoneNumber}`)

    } catch (error) {
        throw new Error(error)
    }
})

module.exports = sendMoney