'use strict';

const databaseManager = require('./databaseManager');

module.exports = async function(userId, foodType) {
  await databaseManager.saveUserFoodToDatabase(userId, foodType).then(item => {
    console.log(item);
  });
};

