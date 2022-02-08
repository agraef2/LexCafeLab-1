const lexResponses = require("./lexResponses");

module.exports = async function (intentRequest) {
  let userFeeling =
    intentRequest.sessionState.intent.slots.user_feelings !== null
      ? intentRequest.sessionState.intent.slots.user_feelings.value
          .interpretedValue
      : "";
  let intentName = intentRequest.sessionState.intent.name;
  let messageContent;

  if (userFeeling === "bad") {
    messageContent = "We are sorry to hear that. Would you like a cup of coffe or a cookie to make your day better?";
  } else {
    messageContent = "Good to hear that. Would you like to order a coffe or food item?";
  }

  let message = { contentType: "PlainText", content: messageContent };

  if (userFeeling !== "") {
    return lexResponses.close(
      intentRequest.sessionAttributes,
      "Fulfilled",
      message,
      intentName
    );
  }
  return lexResponses.delegate(
    intentRequest.sessionAttributes,
    intentRequest.sessionState.intent.slots
  );
};
