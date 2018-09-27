// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('@softbrains/sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (sequelize) {
  const task = sequelize.define('task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['PENDING', 'EXECUTING', 'SUCCESS', 'FAIL'],
      allowNull: true
    }
  }, {
    tableName: 'tasks',
    timestamps: true,
    include: ['@all'],
    hooks: {}
  });

  // eslint-disable-next-line no-unused-vars
  task.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return task;
};
