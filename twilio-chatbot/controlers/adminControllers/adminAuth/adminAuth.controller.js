const asyncErrorHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../../models/admin.model");

const adminLogin = asyncErrorHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input (optional but recommended)
        if (!email || !password) {
            throw new Error("Please provide both email and password");
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            // Send a message to the user
            // Status code 215 shows an auth error
            res.status(215).send("Invalid email or password");

            // Show an error log to the console (useful for diagnosing errors when in production)
            throw new Error("Invalid email or password"); // Avoid revealing email existence
        } else {
        const passwordIsValid = await bcrypt.compare(password, admin.password);

        if (!passwordIsValid) {
            res.status(215).send("Invalid email or password");
            throw new Error("Invalid email or password"); // Avoid revealing password validity
        }

        const adminAuthToken = jwt.sign(
            {
                id: admin._id,
                email: admin.email, // Include additional user info in the token
                name: admin.fullName
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d", // Use a human-readable expiration time
            }
        );

        res.status(200).send(adminAuthToken);
    }

    } catch (error) {
        console.error(error);
        res.status(215).send("Invalid email or password"); // Use appropriate status code
    }
});

module.exports = adminLogin;