"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const uuid = require('uuid');
const _ = require('lodash');

//TODO: refactor to have a function that performs the put based on input to not duplicate code
module.exports.saveOrderToDatabase = async function (userId, coffeeType, coffeeSize) {
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

module.exports.saveUserToDatabase = async function(userId, coffeeType, coffeeSize) {
    console.log('saveUserToDatabase');

    const item = {};
    item.drink = coffeeType;
    item.size = coffeeSize;
    item.userId = userId;

    let tableName = "coffee-user-table";
    const params = {
      TableName: tableName,
      Item: item,
    };

    console.log("PARAMS" + " " + JSON.stringify(params));

    await dynamodb.put(params).promise();
    console.log(`Saving item ${JSON.stringify(item)}`);
    return item;
}

module.exports.findUserFavorite = async function(userId) {
    let tableName = "coffee-user-table";
    const params = {
      TableName: tableName,
      Key: {
          userId
      }
    };
    try {
        let response = await dynamodb.get(params).promise();
        if (_.isEmpty(response)) {
            console.log(`User with userId:${userId} not found`);
            return Promise.reject(new Error(`User with userId:${userId} not found`));
          }
        return response.Item; 
    } catch (error) {
        console.log('ERRRRROR' + '' + error); 
    }
  
}
