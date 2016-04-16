'use strict';
module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
    name: DataTypes.STRING,
    orderNum: DataTypes.INTEGER,
    submit_date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Order.belongsTo(models.Customer);
        Order.belongsTo(models.Salesperson);
        Order.belongsTo(models.Distributor);
        Order.belongsTo(models.Product);
      }
    }
  });
  return Order;
};

    // {
    // classMethods: {
    //   associate: function(models) {
    //     Order.belongsTo(models.Customer, {foreignKey : 'customerId'});
    //     Order.belongsTo(models.Salesperson, {foreignKey : 'salespersonId'});
    //     Order.belongsTo(models.Distributor, {foreignKey : 'distributorId'});
    //     Order.belongsTo(models.Product, {foreignKey : 'productsId'});
    //   }
