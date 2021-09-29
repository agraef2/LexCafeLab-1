"use strict";

const dispatch = require("./dispatch");
const userFavorites = require('./userFavorites');

module.exports.intents = async (event, callback) => {
  try {
    console.log(`event.bot.name=${event.bot.name}`);
    await dispatch(event, (response) => callback(null, response));
  } catch (err) {
    console.log("Top-level catch: ", err.message);
    callback(err);
  }
};

module.exports.saveUserFavorites = async (event, callback) => {
  console.log('saveUserFavorites lambda called');
  try {
    var item = event.Records[0].dynamodb.NewImage;
    console.log(item);
    await userFavorites(item.userId.S, item.drink.S, item.size.S);
    callback(null, null);
  } catch (err) {
    console.log("saveUserFavorites Top-level catch: ", err.message);
  }
};

