const lexResponses = require('./lexResponses');

module.exports = async function(intentRequest) {
  const source = intentRequest.invocationSource;

  if (source === 'FulfillmentCodeHook') {
    return lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled', null);
  }
};
