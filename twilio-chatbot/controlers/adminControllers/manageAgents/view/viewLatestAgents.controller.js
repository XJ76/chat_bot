const asyncErrorHandler = require("express-async-handler");
const Agent = require("../../../../models/agent.model.js");

// Sends the 5 newest agents to the frontend (last created comes first)
const latestAgents = asyncErrorHandler(async (req, res) => {
	// Sort the agents in descending order
	const agents = await Agent.find().sort({ createdAt: -1 }).limit(10);

	res.status(200).send(agents);
})

module.exports = latestAgents;