"use strict";

const lexResponses = require("./lexResponses");
const databaseManager = require("./databaseManager");

const types = ["late", "cappuccino", "americano", "esspresso"];
const sizes = ["double", "normal", "large"];

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

async function validateCoffeeOrder(coffeeType, coffeeSize) {
  if (coffeeType && types.indexOf(coffeeType.toLowerCase()) === -1) {
    return buildValidationResult(
      false,
      "coffee",
      `We do not have ${coffeeType}, would you like a different type of coffee?  Our most popular coffee is americano.`
    );
  }

  if (coffeeSize && sizes.indexOf(coffeeSize.toLowerCase()) === -1) {
    return buildValidationResult(
      false,
      "size",
      `We do not have ${coffeeSize}, would you like a different size of coffee? Our most popular size is normal.`
    );
  }

  if (coffeeType && coffeeSize) {
    //Latte and cappuccino can be normal or large
    if (
      (coffeeType.toLowerCase() === "cappuccino" ||
        coffeeType.toLowerCase() === "late") &&
      !(
        coffeeSize.toLowerCase() === "normal" ||
        coffeeSize.toLowerCase() === "large"
      )
    ) {
      return buildValidationResult(
        false,
        "size",
        `We do not have ${coffeeType} in that size. Normal or large are the available sizes for that drink.`
      );
    }

    //Expresso can be normal or double
    if (
      coffeeType.toLowerCase() === "esspresso" &&
      !(
        coffeeSize.toLowerCase() === "normal" ||
        coffeeSize.toLowerCase() === "double"
      )
    ) {
      return buildValidationResult(
        false,
        "size",
        `We do not have ${coffeeType} in that size. Normal or double are the available sizes for that drink.`
      );
    }

    //Americano is always normal
    if (
      coffeeType.toLowerCase() === "americano" &&
      coffeeSize.toLowerCase() !== "normal"
    ) {
      return buildValidationResult(
        false,
        "size",
        `We do not have ${coffeeType} in that size. Normal is the available sizes for that drink.`
      );
    }
  }

  return buildValidationResult(true, null, null);
}

function buildFulfillmentResult(fulfillmentState, messageContent) {
  return {
    fulfillmentState,
    message: { contentType: "PlainText", content: messageContent },
  };
}

function buildUserFavoriteResult(coffee, size, messageContent) {
  return {
    coffee,
    size,
    message: { contentType: "PlainText", content: messageContent },
  };
}

async function findUserFavorite(userId) {
  let result = await databaseManager.findUserFavorite(userId);
  console.log("findUserFavorite result" + " " + JSON.stringify(result));
  return buildUserFavoriteResult(
    result.drink,
    result.size,
    `Would you like to order a ${result.size} ${result.drink}?`
  );
}

async function fulfillOrder(userId, coffeeType, coffeeSize) {
  console.log("fulfillOrder" + coffeeType + " " + coffeeSize);
  const result = await databaseManager.saveOrderToDatabase(
    userId,
    coffeeType,
    coffeeSize
  );

  return buildFulfillmentResult(
    "Fulfilled",
    `Thanks, your order has been placed`
  );
}

module.exports = async function (intentRequest) {
  let coffeeType = intentRequest.currentIntent.slots.coffee;
  let coffeeSize = intentRequest.currentIntent.slots.size;
  let userId = intentRequest.userId;
  console.log(coffeeType + " " + coffeeSize);

  const source = intentRequest.invocationSource;

  if (source === "DialogCodeHook") {
    const slots = intentRequest.currentIntent.slots;

    if (coffeeType === null && coffeeSize === null) {
      try {
        let result = await findUserFavorite(userId);
        console.log("GET RESULT" + " " + JSON.stringify(result));
        if (result) {
          slots.size = result.size;
          slots.coffee = result.coffee;
        }
        console.log("ABOUT TO CONFIRM INTENT");
        //Ask the user if he will like to order this item
        return lexResponses.confirmIntent(
          intentRequest.sessionAttributes,
          intentRequest.currentIntent.name,
          slots,
          result.message
        );
      } catch {
        //Need to ask the user what they want coffee they want?
        return lexResponses.delegate(
          intentRequest.sessionAttributes,
          intentRequest.currentIntent.slots
        );
      }
    } else {
      const validationResult = await validateCoffeeOrder(
        coffeeType,
        coffeeSize
      );
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
      return lexResponses.delegate(
        intentRequest.sessionAttributes,
        intentRequest.currentIntent.slots
      );
    }
  }

  if (source === "FulfillmentCodeHook") {
    console.log("fulfillmetCodeHook");
    const fulfilledOrder = await fulfillOrder(userId, coffeeType, coffeeSize);
    console.log("fulfilledOrder", fulfillOrder);
    return lexResponses.close(
      intentRequest.sessionAttributes,
      fulfilledOrder.fulfillmentState,
      fulfilledOrder.message
    );
  }
};
