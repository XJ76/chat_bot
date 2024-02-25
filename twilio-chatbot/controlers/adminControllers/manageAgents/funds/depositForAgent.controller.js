const asyncErrorHandler = require("express-async-handler"); // Potentially remove if comfortable with try-catch

// Import models and utils
const Agent = require("../../../../models/agent.model");
const CreateATransactionRecord = require("../../../../utils/createATransaction.util");

// increase agent balancer util
const increaseAgentBalance = require("../../../../utils/agentUtils/increaseAgentBalance.util")

const depositForAgent = asyncErrorHandler(async (req, res) => {
    const { amount, agentNumber } = req.body;
    const AddedBy = req.header("adminAuthToken");

    // Validate agentNumber
    if (!agentNumber || typeof agentNumber !== "string") {
        res.status(215).send(`Invalid agent number: ${ agentNumber }`);
        throw new Error("Invalid agent number. Please provide a valid string.");
    }

    // Validate amount
    if (!amount || typeof amount !== "number" || parseFloat(amount) <= 0) {
        throw new Error("Invalid amount. Amount must be a positive number.");
    }

    // Using ID instead of number
    const agentExists = await Agent.findOne({ agentNumber });

    if (!agentExists) {
        res.status(500).json({ type: "Agent", message: `No agent with the number ${agentNumber} exists !` })
        throw new Error(`No agent with the number ${agentNumber} exists !`);
    }

    try {
        // Update agent balance with transaction
        const updatedAgent = await increaseAgentBalance(agentNumber, amount, agentExists.agentName, agentExists.agentPhoneNumber)

        // Log the transaction
        await CreateATransactionRecord(
            "agentName",
            amount,
            AddedBy,
            agentNumber
        );

        res.send(`Sucessfully deposited USD $${amount} for Agent Number ${updatedAgent.agentNumber}. Agent New balance is USD $${updatedAgent.agentBalance}`);

    } catch (error) {
        console.error(error); // Log the original error for debugging
        throw new Error("Depositing for agent failed. Please try again."); // Consider more specific error message
    }
});

module.exports = depositForAgent;
