const asyncErrorHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Agent = require("../../../models/agent.model");

const addNewAgent = asyncErrorHandler(async (req, res) => {

    // get logged in admin _id
    const addedBy = req.user.id;

    console.log(addedBy)

    try {
        // Validate input
        let {
            agentName,
            agentIdNumber,
            agentAccountType,
            agentCountry,
            agentTownOrCity,
            agentAddress,
            agentPhoneNumber,
            agentEmail,
            password,
        } = req.body;

        const requiredFields = [
            "agentName",
            "agentIdNumber",
            "agentAccountType",
            "agentCountry",
            "agentTownOrCity",
            "agentAddress",
            "agentPhoneNumber",
            "agentEmail",
            "password",
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`${field} is required`);
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(agentEmail)) {
            throw new Error("Invalid email format");
        }

        // Generate agent number
        const lastCreatedAgent = await Agent.findOne().sort({ agentNumber: -1 }).limit(1);

        let agentNumber;

        if (lastCreatedAgent) {
            const lastNumberPart = parseInt(lastCreatedAgent.agentNumber.slice(2), 10);
            const newNumberPart = lastNumberPart + 1;
            agentNumber = `24${newNumberPart.toString().padStart(4, "0")}`;

        } else {
            agentNumber = "240001";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        // Check for existing agent with the same email
        const existingAgent = await Agent.findOne({ agentEmail });

        if (existingAgent) {
            throw new Error(`Agent with email ${agentEmail} already exists.`);
        }

        // Create new agent
        const newAgent = await Agent.create({
            agentNumber,
            agentName,
            agentIdNumber,
            agentAccountType,
            agentCountry,
            agentTownOrCity,
            agentAddress,
            agentPhoneNumber,
            agentEmail,
            addedBy,
            password,
        });

        res.status(201).json(`${newAgent.agentName} successfully added as an agent!`);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message }); // Use appropriate error status code
    }
});

module.exports = addNewAgent;
