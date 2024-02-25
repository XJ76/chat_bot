    const asyncErrorHandler = require("express-async-handler");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    // import agent model
    const Agent = require("../../../models/agent.model");

    const agentLogin = asyncErrorHandler(async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Validate input (optional but recommended)
            if (!email || !password) {
                return res.status(400).json({ error: "Please provide both email and password" });
            }

            const agent = await Agent.findOne({ agentEmail: email });

            if (!agent) {
                return res.status(401).json({ error: "User not found, email is wrong!" });
            }

            const passwordIsValid = await bcrypt.compare(password, agent.password);

            if (!passwordIsValid) {
                return res.status(401).json({ error: "Invalid password" });
            }

            const agentAuthToken = jwt.sign(
                {
                    id: agent._id,
                    email: agent.email, // Include additional user info in the token
                },
                process.env.JWT_AGENT_SECRET,
                {
                    expiresIn: "1d", // Use a human-readable expiration time
                }
            );

            res.status(200).json({ agentAuthToken });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "An error occurred while processing your request" });
        }
    });

    module.exports = agentLogin;