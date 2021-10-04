"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const uuid = require("uuid");
const _ = require("lodash");
const { size } = require("lodash");

//TODO: refactor to have a function that performs the put based on input to not duplicate code
module.exports.saveOrderToDatabase = async function (
  userId,
  coffeeType,
  coffeeSize
) {
  console.log("saveOrderToDatabase");

  const item = {};
  item.orderId = uuid.v1();
  item.drink = coffeeType;
  item.size = coffeeSize;
  item.userId = userId;

  let tableName = "coffee-order-table";
  const params = {
    TableName: tableName,
    Item: item,
  };
  console.log("PARAMS" + " " + JSON.stringify(params));

  await dynamodb.put(params).promise();
  console.log(`Saving item ${JSON.stringify(item)}`);
  return item;
};

module.exports.saveFoodOrderToDatabase = async function (userId, foodType) {
  console.log("saveFoodOrderToDatabase");

  const item = {};
  item.orderId = uuid.v1();
  item.food = foodType;
  item.userId = userId;

  let tableName = "food-order-table";
  const params = {
    TableName: tableName,
    Item: item,
  };
  console.log("PARAMS" + " " + JSON.stringify(params));

  await dynamodb.put(params).promise();
  console.log(`Saving item ${JSON.stringify(item)}`);
  return item;
};

module.exports.saveUserToDatabase = async function (
  userId,
  coffeeType,
  coffeeSize) {

  console.log("saveUserToDatabase");

  // this commented code was used to make the put call to the user table when we were storing only the user's drink. 
  // now we make an update call since we have food and drink coming from different lambdas.

  // let tableName = "coffee-user-table";
  // const params = {
  //   TableName: tableName,
  //   Item: item,
  // };

  // console.log("PARAMS" + " " + JSON.stringify(params));

  // await dynamodb.put(params).promise();
  const key = {};
  key.userId = userId;

  let tableName = "cafe-user-table";
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: "set drink = :d, size = :s",
    ExpressionAttributeValues: {
      ":d": coffeeType,
      ":s": coffeeSize,
    },
    ReturnValues: "UPDATED_NEW",
  };
  console.log(`Saving item ${JSON.stringify(params)}`);
  await dynamodb.update(params).promise();
  return params;
};

module.exports.saveUserFoodToDatabase = async function (userId, foodType) {
  console.log("saveUserToDatabase");

  const key = {};
  key.userId = userId;

  let tableName = "cafe-user-table";
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: "set foodType = :f",
    ExpressionAttributeValues: {
      ":f": foodType,
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log(`Saving item ${JSON.stringify(params)}`);
  await dynamodb.update(params).promise();

  return params;
};

module.exports.findUserFavorite = async function (userId) {
  let tableName = "cafe-user-table";
  const params = {
    TableName: tableName,
    Key: {
      userId,
    },
  };
  try {
    let response = await dynamodb.get(params).promise();
    if (_.isEmpty(response)) {
      console.log(`User with userId:${userId} not found`);
      return Promise.reject(new Error(`User with userId:${userId} not found`));
    }
    return response.Item;
  } catch (error) {
    console.log("ERROR" + "" + error);
  }
};

module.exports.getStoreInfo = async function (infoType) {
  let tableName = "store-information-table";

  const params = {
    TableName: tableName,
    Key: {
      infoType,
    },
  };
  try {
    let response = await dynamodb.get(params).promise();
    if (_.isEmpty(response)) {
      console.log(`Info type of :${infoType} not found`);
      return Promise.reject(new Error(`Info type of :${infoType} not found`));
    }
    return response.Item;
  } catch (error) {
    console.log("ERROR" + "" + error);
  }
};
