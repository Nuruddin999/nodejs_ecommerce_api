'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Products', 'description', {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Products', 'description')
    ]);
  }
};
