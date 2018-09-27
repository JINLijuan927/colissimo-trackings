// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('@softbrains/sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (sequelize) {
  const shipment = sequelize.define('shipment', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'trackingnumber'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['CREATED', 'VALIDATED', 'CLEARED', 'DELIVERING', 'ARRIVED', 'RETURNED', 'ERROR'],
      allowNull: true
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deliveredat'
    }
  }, {
    tableName: 'shipments',
    timestamps: false,
    include: ['@all'],
    hooks: {}
  });

  // eslint-disable-next-line no-unused-vars
  shipment.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return shipment;
};
