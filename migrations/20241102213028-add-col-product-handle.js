'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Products', 'handle', {
        type: Sequelize.DataTypes.String,
        allowNull: true,
      })
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Products', 'handle')
    ]);
  }
};