const asyncErrorHandler = require("express-async-handler");
const Agent = require("../../../../models/agent.model");

//  Get statistics about new agents (agents added in the last month)
const getNewAgentStats = asyncErrorHandler(async (req, res) => {

	// Create an array of months (for simplicity)
	const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

	// Get the current month
	// Will be returned as a number where is 0 is January, February is 1, March is 2....
	const month  = new Date().getMonth();

	// Get the current month
	const year  = new Date().getFullYear();

	// Get the previous month
	let previousMonth;

	/*
		Please note that months.length is 12 even though the last month "December" is at position 11 of the array"
		Therefor never use months.length, if you do, make sure it's always months.length -1
	*/


	// If we are in January (month 0)
	if(month === 0) {
		// Make previous month the last month of the year (December)
		// See note above
		previousMonth = `${months.length - 1}`;
	} else {
		// Otherwise, the previous month is just month(see above) - 1 
		previousMonth = `${month}`;

		// If previousMonth is a single digit
		if(previousMonth <= 9) {
			//Add a zero at the beginning
			previousMonth = `0${previousMonth}`;
		}
	}

	// Get the agents created in the previous month
	const lastMonthsAgents = await Agent.find({ dateAdded: { 
		// lte: Less than the previous month of this year
		$lte: `${year}-${previousMonth}-08T17:02:10.649Z`} 
	})

	// if(lastMonthsAgents would not work because if there are no documents that match that query, it will return an empty array[])
	// Instead of undefined
	if(lastMonthsAgents.length === 0 /* If there is nothing in the returned array (0 results) */) {
		console.log("No agents added in the last month")
		res.status(404);
	} else {
		const allAgents = await Agent.find();

		// If agents were created last month, calculate percentage increase or decrease
		// lastMonth's agents / all agents * 100%
		console.log({ "Last month's agents": lastMonthsAgents.length })
		console.log({ "All agents": allAgents.length })
		console.log({ percentage: ( parseInt(lastMonthsAgents.length) / parseInt(allAgents.length) ) * 100  })
		const percentage = ( parseInt(lastMonthsAgents.length) / parseInt(allAgents.length) ) * 100 // Normally multiplication would come first but the brackets ensure it divides first

		res.status(200).json({ lastMonthsAgents, percentage });
	}
});

module.exports = getNewAgentStats;