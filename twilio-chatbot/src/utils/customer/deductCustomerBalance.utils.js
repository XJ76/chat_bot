const asyncErrorHandler = require("express-async-handler");
const Customer = require("../../models/customer.model")

const deductCustomerBalance = asyncErrorHandler(async (customerPhoneNumber, amount) => {
    try {
        // Parse amount to ensure it's a valid number
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            throw new Error('Invalid amount');
        }

        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerPhoneNumber },
            { $inc: { customerBalance: - parsedAmount } },
            { new: true }
        );

        if (!updatedCustomer) {
            throw new Error('Customer not found');
        }

        return updatedCustomer;

    } catch (error) {
        throw new Error(`Failed to deduct customer balance: ${error.message}`);
    }
})

module.exports = deductCustomerBalance;