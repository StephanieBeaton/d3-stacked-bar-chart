'use strict';
module.exports = function(sequelize, DataTypes) {
  var Salesgroup = sequelize.define('Salesgroup', {
    name: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Salesgroup.hasMany(models.Salesperson);
      }
    }
  });
  return Salesgroup;
};
