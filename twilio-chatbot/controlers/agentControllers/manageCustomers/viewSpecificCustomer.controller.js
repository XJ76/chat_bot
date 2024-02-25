const asyncErrorHandler = require("express-async-handler")

// import customer model
const Customer = require("../../../models/customer.model")

const addNewCustomer = asyncErrorHandler( async ( req, res ) =>{
    const customerPhoneNumber = req.params.customerPhoneNumber;

    const customer = await Customer.findOne({ customerPhoneNumber });

    if(!customer){
        throw new Error(`Customer ${customerPhoneNumber} does not exist!`);
    }

    res.json(customer);
} )

module.exports = addNewCustomer;
