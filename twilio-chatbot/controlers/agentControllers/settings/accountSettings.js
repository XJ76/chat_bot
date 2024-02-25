const Agent = require('../../../models/agent.model');

const updatePasswordController = async (req, res) => {
    const { agentEmail, oldPassword, newPassword } = req.body;
  
    try {
      // Fetch agent from the database using email
      const agent = await Agent.findOne({ agentEmail });
  
      // Check if the agent with the provided email exists
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
  
      // Check if the provided old password matches the agent's current password
      const isPasswordValid = await bcrypt.compare(oldPassword, agent.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect old password' });
      }
  
      // Hash the new password before updating
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update agent's password
      agent.password = hashedNewPassword;
      await agent.save();
  
      // Respond with success message
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      // Check for specific errors
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid agent ID format' });
      }
      // Handle other types of errors
      return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { updatePasswordController };