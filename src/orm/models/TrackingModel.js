// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('@softbrains/sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (sequelize) {
  const tracking = sequelize.define('tracking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'trackingnumber'
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    event: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'trackings',
    timestamps: false, // TODO
    include: ['@all'],
    hooks: {}
  });

  // eslint-disable-next-line no-unused-vars
  tracking.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return tracking;
};
