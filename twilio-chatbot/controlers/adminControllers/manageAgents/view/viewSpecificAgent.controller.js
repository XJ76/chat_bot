// agent model import
const Agent = require("../../../../models/agent.model")

const asyncErrorHandler = require("express-async-handler")

const viewSpecificAgent = asyncErrorHandler(async (req, res) => {
    try {
        const { agentNumber } = req.params; // Assume agent ID is passed in the URL params

        const agent = await Agent.findOne({ agentNumber });

        if (!agent) {
            throw new Error(`Agent ${agentNumber} does now exist!`)
        }

        res.json(agent);

    } catch (error) {
        throw new Error(error)
    }
});

module.exports = viewSpecificAgent