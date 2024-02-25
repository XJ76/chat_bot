const asyncErrorHandler = require("express-async-handler")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import the model for admin
const Admin = require("../../models/admin.model")

const addNewAdmin = asyncErrorHandler(async (req, res) => {
    let { fullName, email, password } = req.body

    // harsh password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)

    const adminEmailExists = await Admin.findOne({ email })

    if (!adminEmailExists) {

        // create a new admin
        try {
            const newAdmin = await Admin.create({
                fullName,
                email,
                password
            })

            res.status(201)
                .json(`${newAdmin.fullName} successfully added`)

        } catch (error) {
            throw new Error(error)
        }

    } else {
        throw new Error(`${email} already exists as an admin.`)
    }
})

module.exports = addNewAdmin