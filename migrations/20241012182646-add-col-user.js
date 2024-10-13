'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'isDeletedPlace', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'isDeletedPlace' ),
    ]);
  }
};;
