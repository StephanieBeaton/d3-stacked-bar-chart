'use strict';
module.exports = function(sequelize, DataTypes) {
  var Distributor = sequelize.define('Distributor', {
    name: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Distributor.hasMany(models.Order);
      }
    }
  });
  return Distributor;
};
