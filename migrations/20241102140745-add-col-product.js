'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Products', 'isForStartPage', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      })
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Products', 'isForStartPage')
    ]);
  }
};
