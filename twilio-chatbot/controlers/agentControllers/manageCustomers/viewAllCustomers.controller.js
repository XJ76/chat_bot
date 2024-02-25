const asyncErrorHandler = require("express-async-handler")

// import customer model
const Customer = require("../../../models/customer.model")

// Function to retrieve all customers
const getAllCustomers = asyncErrorHandler(async (req, res) => {
    try {
        // Fetch all customers from the database
        const customers = await Customer.find();

        // Return the customers as a response
        res.status(200).json(customers);
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error retrieving customers:", error);

        // Respond with an internal server error
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = getAllCustomers;