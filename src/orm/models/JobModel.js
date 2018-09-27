// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('@softbrains/sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (sequelize) {
  const job = sequelize.define('job', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      // values: ['PENDING', 'EXECUTING', 'SUCCESS', 'FAIL'],
      allowNull: true
    }
  }, {
    tableName: 'jobs',
    timestamps: true,
    include: ['@all'],
    hooks: {}
  });

  // eslint-disable-next-line no-unused-vars
  job.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return job;
};
