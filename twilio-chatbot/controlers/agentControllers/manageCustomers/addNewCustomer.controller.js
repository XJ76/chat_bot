const asyncErrorHandler = require("express-async-handler")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import customer model
const Customer = require("../../../models/customer.model")

const addNewCustomer = asyncErrorHandler(async (req, res) => {
    const addedBy = req.user.id
    console.log(addedBy)
    
    // get values from req.body bro
    let { customerFirstName, customerLastName, customerGender, customerAccountType, customerIdNumber, customerDateofBirth, customerPhoneNumber, customerPinCode } = req.body;

    // generate random 4 numbers customerPinCode and hash it
    customerPinCode = "1234"
    
    // Generate a random 4-digit number as a string
    // customerPinCode = Math.random().toString().substring(2, 6); // Ensures a 4-digit string

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
            .json(`${newCustomerAdded.customerFirstName} ${newCustomerAdded.customerLastName} successfully added as a new customer.`)

    } catch (error) {
        throw new Error(error.message)
    }

})

module.exports = addNewCustomer;