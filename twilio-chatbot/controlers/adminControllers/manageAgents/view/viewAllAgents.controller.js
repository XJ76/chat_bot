// agent model import
const Agent = require("../../../../models/agent.model")

const viewAllAgents = async (req, res) => {
    // Fetch all agents
    const agents = await Agent.find();

    // Send the agents data as a JSON response
    res.status(200).send(agents);
};

module.exports = viewAllAgents