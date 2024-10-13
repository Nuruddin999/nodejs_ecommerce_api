'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('ProductFiles', 'productId', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Products',
          key: 'id',
        }
      }),
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('ProductFiles', 'productId' ),
    ]);
  }
};
