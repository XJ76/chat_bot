const asyncErrorHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import customer model
const Customer = require("../../../models/customer.model");

const customerLogin = asyncErrorHandler(async (req, res) => {
    const { customerPhoneNumber, customerPinCode } = req.body;

    // Data validation (example)
    if (!customerPhoneNumber || !customerPinCode) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Customer lookup (replace with your database query)
    const customer = await Customer.findOne({ customerPhoneNumber });

    if (!customer) {
        return res.status(401).json({ message: "Invalid credentials" }); // Prevent revealing non-existent accounts
    }

    // Secure PIN code comparison (assuming PIN codes are hashed)
    const isMatch = await bcrypt.compare(customerPinCode, customer.customerPinCode);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT (example)
    const token = jwt.sign({ id: customer._id }, process.env.JWT_CUSTOMER_SECRET, { expiresIn: '1h' });

    // Return successful response
    res.json({
        message: "Login successful",
        id: customer._id,
        token,
    });
});

module.exports = customerLogin;
