'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      orderNum: {
        type: Sequelize.INTEGER
      },
      submit_date: {
        type: Sequelize.DATE
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      ProductId: {
        type: Sequelize.INTEGER,
        references: { model: 'Products', key: 'id' }
      },
      CustomerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Customers', key: 'id' }
      },
      SalespersonId: {
        type: Sequelize.INTEGER,
        references: { model: 'Salespeople', key: 'id' }
      },
      DistributorId: {
        type: Sequelize.INTEGER,
        references: { model: 'Distributors', key: 'id' }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Orders');
  }
};

