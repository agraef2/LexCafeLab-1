'use strict';

const databaseManager = require('./databaseManager');

module.exports = async function(userId, drink, size) {
  await databaseManager.saveUserToDatabase(userId, drink, size).then(item => {
    console.log(item);
  });
};

