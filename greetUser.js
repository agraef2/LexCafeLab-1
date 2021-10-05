const lexResponses = require('./lexResponses');

module.exports = async function(intentRequest) {
  const source = intentRequest.invocationSource;
  let userFeeling = intentRequest.currentIntent.slots.user_feeling;
  let messageContent;

  if (userFeeling === 'bad') {
    messageContent = "We are sorry to hear that. Would you like a cup of coffe or a cookie to make your day better?"
  } else {
    messageContent = "Good to hear that. Would you like to order a coffe or food item?"
  }

  let message = { contentType: "PlainText", content: messageContent };
  
  if (source === 'FulfillmentCodeHook') {
    return lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled', message);
  }
};
