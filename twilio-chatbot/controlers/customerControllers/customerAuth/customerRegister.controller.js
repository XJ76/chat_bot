const asyncErrorHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import customer model
const Customer = require("../../../models/customer.model");

const customerRegister = asyncErrorHandler(async (req, res) => {
    let { customerFirstName, customerLastName, customerGender, customerAccountType, customerIdNumber, customerDateofBirth, customerPhoneNumber, customerPinCode } = req.body;

    // hash customerPinCode
    const salt = await bcrypt.genSalt(10)
    customerPinCode = await bcrypt.hash(customerPinCode, salt);

    // check if customer phone number doesn't exist
    const customerExists = await Customer.findOne({ customerPhoneNumber });

    if (customerExists) {
        throw new Error(`Customer ${customerPhoneNumber} already exists`)
    }

    try {
        const newCustomerAdded = await Customer.create({
            customerFirstName,
            customerLastName,
            customerGender,
            customerAccountType,
            customerIdNumber,
            customerRegisteredBy: addedBy,
            customerDateofBirth,
            customerPhoneNumber,
            customerPinCode,
            addedBy
        })

        res.status(201)
            .json(`${newCustomerAdded.customerFirstName} ${newCustomerAdded.customerLastName} you have succeffsully registered and account. Proceed to Login.`)

    } catch (error) {
        throw new Error(error.message)
    }
});

module.exports = customerRegister;
