const express = require('express');
const bodyParser = require('body-parser');
const webhookController = require('./controlers/webHookController');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello, Twilio Chatbot!');
});

app.post('/webhook', webhookController.handleIncomingMessage);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});