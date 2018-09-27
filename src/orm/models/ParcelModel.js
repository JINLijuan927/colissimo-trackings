// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('@softbrains/sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (sequelize) {
  const parcel = sequelize.define('parcel', {
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
    onlinedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'onlinedat'
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deliveredat'
    }
  }, {
    tableName: 'parcels',
    timestamps: false,
    include: ['@all'],
    hooks: {}
  });

  // eslint-disable-next-line no-unused-vars
  parcel.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return parcel;
};
