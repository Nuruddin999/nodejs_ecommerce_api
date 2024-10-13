'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Products', 'mainThumbUrl', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Products', 'mainThumbType', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Products', 'mainThumbUrl'),
      queryInterface.removeColumn('Products', 'mainThumbType')
    ]);
  }
};
