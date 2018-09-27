const requireGlob = require('require-glob');
const _ = require('lodash');
const Sequelize = require('@softbrains/sequelize');
const { Op, DataTypes } = Sequelize;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

module.exports = function (app) {
  initSequelize(app);
  initModels(app);
};

function initSequelize(app){
  const connectionString = app.get('db');
  const sequelize = new Sequelize(connectionString, {
    logging: true,
    operatorsAliases,
    define: {
      freezeTableName: true
    },
    dialectOptions: {
      ssl: true
    }
  });

  // !!! temporal solution
  // TODO replace this by type: JSON, fix database
  sequelize.textJson = function(name, options = {}){
    options.type = DataTypes.TEXT;
    options.defaultValue = '{}';
    options.get = function(){
      return JSON.parse(this[name]);
    };
    options.set = function(value){
      this.setDataValue(name, JSON.stringify(value));
    };
    return options;
  };

  app.sequelize = sequelize;
  return sequelize;
}

function initModels(app){
  const modules = requireGlob.sync('./models/*.js');
  _.each(modules, (createModel) => createModel(app.sequelize));

  // add association
  const models = app.sequelize.models;
  Object.keys(models).forEach(name => {
    if ('associate' in models[name]) {
      models[name].associate(models);
    }
  });
  app.models = app.sequelize.models;
  return models;
}
