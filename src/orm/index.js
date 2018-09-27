const sequelize = require('./sequelize');
const data = require('./data');

/**
 * This module will expose `sequelize`, `models` and initData
 * @param app
 */
module.exports = function(app){
  app.configure(sequelize);
  app.configure(data);
};


