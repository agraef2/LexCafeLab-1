"use strict";

module.exports.delegate = function (sessionAttributes, slots) {
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: "Delegate",
      },
      intent: {
        slots,
        confirmationState: "None",
        name: "CoffeeOrder",
        state: "InProgress",
      },
    },
  };
};
module.exports.elicitSlot = function (
  sessionAttributes,
  intentName,
  slots,
  slotToElicit,
  message
) {
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: "ElicitSlot",
        slotToElicit,
      },
      intent: {
        slots,
        confirmationState: "None",
        name: "CoffeeOrder",
        state: "InProgress",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: message.content,
      },
    ],
  };
};
module.exports.close = function (
  sessionAttributes,
  fulfillmentState,
  message,
  intentName
) {
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: "Close",
        fulfillmentState,
      },
      intent: {
        confirmationState: "Confirmed",
        name: intentName,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: message.content,
      },
    ],
  };
};

module.exports.confirmIntent = function (
  sessionAttributes,
  intentName,
  slots,
  message
) {
  return {
    sessionState: {
      sessionAttributes,
      dialogAction: {
        type: "ConfirmIntent",
      },
      intent: {
        slots,
        confirmationState: "None",
        name: "CoffeeOrder",
        state: "InProgress",
      },
      messages: [
        {
          contentType: "PlainText",
          content: JSON.stringify(message),
        },
      ],
    },
  };
};
