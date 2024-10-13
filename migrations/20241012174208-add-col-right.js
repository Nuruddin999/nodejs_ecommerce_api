'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Rights', 'userId', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        }
      }),
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('Rights', 'userId' ),
    ]);
  }
};
