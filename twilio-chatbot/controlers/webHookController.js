const MessagingResponse = require("twilio").twiml.MessagingResponse;
const twilioClient = require("twilio")(
  "AC8bd5b8fa30180551cef6d008f1ce59aa",
  "7ea38ae1ad68159b4d5a39d5105ad070"
);

const userSessions = {};

exports.handleIncomingMessage = async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMessage = req.body.Body.toLowerCase().trim();
  const senderPhoneNumber = req.body.From;

  try {
    if (!userSessions[senderPhoneNumber]) {
      // Initiate session
      userSessions[senderPhoneNumber] = {
        phoneNumber: "",
        password: "",
        loggedIn: false,
        phoneNumberEntered: false,
        passwordEntered: false,
      };

      if (incomingMessage === "hi" || incomingMessage === "hello") {
        // Welcome message and login/register prompt
        twiml.message(
          " Welcome to Noq Cash! How can I help you today?\n\n1️⃣ Login\n2️⃣ Register"
        );
      } else {
        // Prompt for 'hi' to start
        twiml.message('❓ Please type "hi" to start.');
      }
    } else if (!userSessions[senderPhoneNumber].loggedIn) {
      // Handle login/register flow
      if (incomingMessage === "1") {
        // Prompt for phone number
        twiml.message(
          ' Please enter your phone number in the format: "PhoneNumber"'
        );
        userSessions[senderPhoneNumber].phoneNumberEntered = true;
      } else if (incomingMessage === "2") {
        // Handle registration
        twiml.message("✏️ Please provide your details to register.");
      } else if (userSessions[senderPhoneNumber].phoneNumberEntered) {
        // User entered phone number, store it
        userSessions[senderPhoneNumber].phoneNumber = incomingMessage;
        userSessions[senderPhoneNumber].phoneNumberEntered = false;
        // Proceed with password prompt
        twiml.message(" Please enter your password.");
        userSessions[senderPhoneNumber].passwordEntered = true;
      } else if (userSessions[senderPhoneNumber].passwordEntered) {
        // User entered password, verify login
        // Replace with your secure password validation logic (e.g., using a password hashing library)
        if (
          userSessions[senderPhoneNumber].phoneNumber === "0782487769" &&
          incomingMessage === "password123" // Replace with actual credentials and validation
        ) {
          // Login successful
          userSessions[senderPhoneNumber].loggedIn = true;
          twiml.message(
            " You have successfully logged in. What would you like to do?"
          );
          twiml.message(
            "🏦 *Welcome to NoQ Cash!* How can I help you today?\n\n" +
            "1️⃣ *Send Money*\n" +
            "2️⃣ *Request Payment*\n" +
            "3️⃣ *Transfer History*\n" +
            "4️⃣ *Visa Card Application*\n" +
            "5️⃣ *Bills & Payments*\n" +
            "6️⃣ *Loyalty Points*\n" +
            "7️⃣ *My Account*\n"
          );
        } else {
          // Login failed
          twiml.message("❌ Incorrect credentials. Please try again.");
          // Reset session for retry
          userSessions[senderPhoneNumber].phoneNumberEntered = false;
          userSessions[senderPhoneNumber].passwordEntered = false;
        }
      } else {
        // Prompt for login/register choice
        twiml.message(
          '❓ Please choose from the options: "1️⃣ Login" or "2️⃣ Register".'
        );
      }
    } else {
      // User is logged in, handle menu options
      if (incomingMessage === "1") {
        twiml.message(
          "📤 *Send Money*\n" +
          "Please enter the recipient's Phone Number and amount to send."
        );
      } else if (incomingMessage === "2") {
        twiml.message(
          "🔗 *Request Payment*\n" +
          "To request payment, enter the details of the payment request."
        );
      } else if (incomingMessage === "3") {
        twiml.message(
          "🔄 *Transfer History*\n" +
          "View your transaction history and details here."
        );
      } else if (incomingMessage === "4") {
        twiml.message(
          "💳 *Visa Card Application*\n" +
          "Apply for a NoQ Cash Visa card for convenient transactions.\n\n" +
          "1️⃣ *Physical Visa Card*\n" +
          "2️⃣ *Virtual Visa Card*\n"
        );
      } else if (incomingMessage === "5") {
        // Sub-menu for Bills & Payments
        twiml.message(
          "💸 *Bills & Payments*\n\n" +
          "Manage and pay your bills seamlessly through NoQ Cash.\n" +
          "1️⃣ *Buy Airtime*\n" +
          "2️⃣ *Nyaradzo Funeral Policy*\n" +
          "3️⃣ *Buy Electricity*\n" +
          "4️⃣ *Eco Sure Life Cover*\n" +
          "5️⃣ *Back*\n"
        );

        // EDIT THIS MENU FOR BILLS AND PAYMENTS(OPTION 5)
        // if (incomingMessage === "1") {
        //   // Handle Buy Airtime sub-options
        //   twiml.message("Implementing Buy Airtime options...");
        // } else if (incomingMessage === "2") {
        //   // Handle Nyaradzo Funeral Policy sub-options
        //   twiml.message("Implementing Nyaradzo Funeral Policy options...");
        // } else if (incomingMessage === "3") {
        //   // Handle Buy Electricity sub-options
        //   twiml.message("Implementing Buy Electricity options...");
        // } else if (incomingMessage === "4") {
        //   // Handle Eco Sure Life Cover sub-options
        //   twiml.message("Implementing Eco Sure Life Cover options...");
        // } else if (incomingMessage === "5") {
        //   // Go back to main menu
        //   twiml.message("Returning to main menu...");
        // } else {
        //   // Invalid option
        //   twiml.message("Invalid option. Please choose from the available options.");
        // }

      }   
       
    } 

    // Send response
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.error("Error:", error);
  }
};
