'use strict';
module.exports = function(sequelize, DataTypes) {
  var Salesperson = sequelize.define('Salesperson', {
    name: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Salesperson.hasMany(models.Order);
        Salesperson.belongsTo(models.Salesgroup);
      }
    }
  });
  return Salesperson;
};
