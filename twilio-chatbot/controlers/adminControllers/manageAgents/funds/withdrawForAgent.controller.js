const asyncErrorHandler = require("express-async-handler");
const Agent = require("../../../../models/agent.model");

// create a transaction util
const CreateATransactionRecord = require("../../../../utils/createATransaction.util");

// increase agent balancer util
const deductAgentBalance = require("../../../../utils/agentUtils/deductAgentBalance.util")

const withdrawForAgent = asyncErrorHandler(async (req, res) => {

    const { amount, agentNumber } = req.body;
    const AddedBy = req.header("adminauthtoken");

    // Validate amount thoroughly
    if (!amount) {
        throw new Error("Amount is required");
    }

    if (parseFloat(amount) <= 0) {
        throw new Error("Invalid amount. Amount must be correct.");
    }

    const agentExists = await Agent.findOne({ agentNumber });

    if (!agentExists) {
        res.status(500).send(`Agent ${agentNumber} does not exist!`);
        throw new Error(`Agent ${agentNumber} does not exist!`);
    }

    // Validate balance before withdrawal
    if (agentExists.agentBalance < amount) {
        throw new Error(`Agent ${agentNumber} has insufficient balance.`);
    }

    try {
        // Update agent balance with transaction
        const updatedAgent = await deductAgentBalance( agentNumber, amount )

        // Log the transaction
        await CreateATransactionRecord(
            "withdrawforagent",
            amount,
            agentNumber,
            AddedBy
        );

        res.json(`Successfully withdrawn USD $${amount} from Agent Number ${updatedAgent.agentNumber} account. Agent New balance is now USD $${updatedAgent.agentBalance}`);

    } catch (error) {
        console.error(error); // Log the error for debugging
        throw new Error("Withdraw failed. Please try again.");
    }

});

module.exports = withdrawForAgent;
