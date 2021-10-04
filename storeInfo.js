"use strict";

const lexResponses = require("./lexResponses");
const databaseManager = require("./databaseManager");


module.exports = async function (intentRequest) {
  let infoType = intentRequest.currentIntent.slots.InfoType;
  console.log(infoType);

  const source = intentRequest.invocationSource;

  if (source === "DialogCodeHook") {
    return lexResponses.delegate(
      intentRequest.sessionAttributes,
      intentRequest.currentIntent.slots
    );
  } else if (source === "FulfillmentCodeHook") {
    console.log("fulfillmetCodeHook");
    const storeInfo = await getStoreInfo(infoType);
    console.log("after getStoreInfo", storeInfo);
    return lexResponses.close(
      intentRequest.sessionAttributes,
      storeInfo.fulfillmentState,
      storeInfo.message
    );
  }
};

async function getStoreInfo(infoType) {
  console.log("getStoreInfo" + infoType);
  const result = await databaseManager.getStoreInfo(
    infoType
  );
  console.log(JSON.stringify(result));

  if (infoType === 'hours') {
    return buildFulfillmentResult(
        "Fulfilled",
        `Our store hours are: ${result.hours}`
      );
  } else if (infoType === 'address') {
    return buildFulfillmentResult(
        "Fulfilled",
        `Our address is: ${result.address}`
      );
  }
  
}

function buildFulfillmentResult(fulfillmentState, messageContent) {
  return {
    fulfillmentState,
    message: { contentType: "PlainText", content: messageContent },
  };
}

