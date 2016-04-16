'use strict';
module.exports = function(sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Customer.hasMany(models.Order);
      }
    }

  //   , {
  //       hooks: {
  //          beforeCreate: function (customer, options, fn) {
  //              customer.createdAt = new Date();
  //              customer.updatedAt = new Date();
  //              fn(null, customer);
  //          },
  //          beforeUpdate: function (customer, options, fn) {
  //              customer.updatedAt = new Date();
  //              fn(null, customer);
  //          }
  //      }
  });
  return Customer;
};
