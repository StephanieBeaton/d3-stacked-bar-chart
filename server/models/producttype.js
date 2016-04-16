'use strict';
module.exports = function(sequelize, DataTypes) {
  var Producttype = sequelize.define('Producttype', {
    name: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Producttype.hasMany(models.Product);
      }
    }
  });
  return Producttype;
};
