const MessagingResponse = require('twilio').twiml.MessagingResponse;
const twilioClient = require('twilio')(
  'AC82a8b7d67ff99529dbdd0ffb93072976',
  '336b546a8431de0a8a06ba585a75d2c8'
);

let userSessions = {}; // Object to store user sessions

exports.handleIncomingMessage = async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMessage = req.body.Body.toLowerCase().trim(); // Convert to lowercase and trim whitespace
  const senderPhoneNumber = req.body.From;

  try {
    if (!userSessions[senderPhoneNumber]) {
      // User session does not exist, prompt for login or register
      if (incomingMessage === 'hi'|| incomingMessage === "Hi" || incomingMessage ==="hallo" ) {
        // Send a welcome message and prompt for login or register
        twiml.message('🏦 Welcome to Noq Cash! How can I help you today?\n\n1️⃣ Login\n2️⃣ Register');
      } else {
        // Prompt the user to type 'hi' to start
        twiml.message('❓ Please type "hi" to start.');
      }
    } else if (!userSessions[senderPhoneNumber].loggedIn) {
      // User is not logged in, prompt for login or register
      if (incomingMessage === '1') {
        // Handle login option
        twiml.message('🔐 Please enter your phone number and password in the format: "PhoneNumber Password"');
      } else if (incomingMessage === '2') {
        // Handle register option
        twiml.message('✏️ Please provide your details to register.');
      } else {
        // Prompt the user to choose login or register
        twiml.message('❓ Please choose from the options: "1️⃣ Login" or "2️⃣ Register".');
      }
    } else {
      // User is logged in, show menu options
      if (incomingMessage === '1') {
        // Handle balance inquiry
        twiml.message('💰 Your current account balance is $1000.');
      } else if (incomingMessage === '2') {
        // Handle funds transfer
        twiml.message('💸 Please enter recipient\'s phone number and the amount in the format: "RecipientPhoneNumber Amount"');
      } else if (incomingMessage === '3') {
        // Handle withdrawal
        twiml.message('💸 Please enter the amount you want to withdraw.');
      } else if (incomingMessage === '4') {
        // Handle deposit
        twiml.message('💸 Please enter the amount you want to deposit.');
      } else if (incomingMessage === '5') {
        // Handle account settings
        twiml.message('⚙️ Here you can update your account settings.');
      } else {
        // For any other message, provide a default response
        twiml.message('❓ Sorry, I didn\'t understand that. Please choose from the available options.');
      }
    }

    // Send the response
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

    // Check if the user logged in, and update session
    if (!userSessions[senderPhoneNumber] && incomingMessage === '1') {
      // Handle login option
      twiml.message('🔐 Please enter your phone number and password in the format: "PhoneNumber Password"');
      userSessions[senderPhoneNumber] = { phoneNumber: true }; // Save the phone number flag in the session
    } else if (userSessions[senderPhoneNumber] && userSessions[senderPhoneNumber].phoneNumber) {
      // If the user entered the phone number
      // Save the phone number and prompt for the password
      userSessions[senderPhoneNumber].phoneNumber = incomingMessage;
      twiml.message('🔐 Please enter your password.');
      userSessions[senderPhoneNumber].password = true; // Save the password flag in the session
    } else if (userSessions[senderPhoneNumber] && userSessions[senderPhoneNumber].password) {
      // If the user entered the password
      // Check if the phone number and password are correct to log in
      if (userSessions[senderPhoneNumber].phoneNumber === '0715483327' && incomingMessage === 'password123') {
        userSessions[senderPhoneNumber].loggedIn = true;
        twiml.message('🔓 You have successfully logged in. What would you like to do?');
        twiml.message('🏦 Welcome to Noq Cash! How can I help you today?\n\n1️⃣ Balance Inquiry\n2️⃣ Funds Transfer\n3️⃣ Withdrawal\n4️⃣ Deposit\n5️⃣ Account Settings');
      } else {
        // If the password is incorrect
        twiml.message('❌ Incorrect password. Please enter your password.');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};