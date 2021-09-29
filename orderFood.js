"use strict";

const lexResponses = require("./lexResponses");
const databaseManager = require("./databaseManager");

const options = ["breakfast sandwich", "bagel", "cookie"];

module.exports = async function (intentRequest) {
  let foodType = intentRequest.currentIntent.slots.foodType;
  let userId = intentRequest.userId;
  console.log(foodType);

  const source = intentRequest.invocationSource;

  if (source === "DialogCodeHook") {
    const slots = intentRequest.currentIntent.slots;
    if (foodType !== null) {
      const validationResult = await validateFoodOrder(foodType);
      console.log("validationResult" + JSON.stringify(validationResult));

      if (!validationResult.isValid) {
        return lexResponses.elicitSlot(
          intentRequest.sessionAttributes,
          intentRequest.currentIntent.name,
          slots,
          validationResult.violatedSlot,
          validationResult.message
        );
      }
    }

    return lexResponses.delegate(
      intentRequest.sessionAttributes,
      intentRequest.currentIntent.slots
    );
  } else if (source === "FulfillmentCodeHook") {
    console.log("fulfillmetCodeHook");
    const fulfilledOrder = await fulfillOrder(userId, foodType);
    console.log("fulfilledOrder", fulfillOrder);
    return lexResponses.close(
      intentRequest.sessionAttributes,
      fulfilledOrder.fulfillmentState,
      fulfilledOrder.message
    );
  }
};

async function fulfillOrder(userId, foodType) {
  console.log("fulfillOrder" + foodType);
  const result = await databaseManager.saveFoodOrderToDatabase(
    userId,
    foodType
  );

  return buildFulfillmentResult(
    "Fulfilled",
    `Thanks, your orderid ${result.orderId} has been placed`
  );
}

function buildFulfillmentResult(fulfillmentState, messageContent) {
  return {
    fulfillmentState,
    message: { contentType: "PlainText", content: messageContent },
  };
}

function buildValidationResult(isValid, violatedSlot, messageContent) {
  if (messageContent == null) {
    return {
      isValid,
      violatedSlot,
    };
  }
  return {
    isValid,
    violatedSlot,
    message: { contentType: "PlainText", content: messageContent },
  };
}

async function validateFoodOrder(foodType) {
  if (foodType && options.indexOf(foodType.toLowerCase()) === -1) {
    return buildValidationResult(
      false,
      "foodType",
      `We do not have ${foodType}, would you like a something else?  Our most popular food item is our Breakfast Sandwich.`
    );
  }

  return buildValidationResult(true, null, null);
}
