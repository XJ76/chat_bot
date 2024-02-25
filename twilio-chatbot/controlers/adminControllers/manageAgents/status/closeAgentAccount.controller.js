const asyncErrorHandler = require("express-async-handler");
const Agent = require("../../../../models/agent.model.js");

const closeAccount = asyncErrorHandler(async (req, res) => {
	// Retreive the agent's id
	const id = req.header("id");
	console.log({ "id": id })

	// Find agent with the corresponding id and update their status
	const agent = await Agent.findOneAndUpdate({ _id: id }, { agentStatus: "Closed" });

	// Get the updated agents list
	const allAgents = await Agent.find();	

	console.log(allAgents)

	// No if check because agent will always be true
	// Because the previous steps of the process
	// Ensure that id is never undefined
	res.status(200).send(allAgents);
})

module.exports = closeAccount;