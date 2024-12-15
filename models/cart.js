'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        onDelete: 'cascade'
      })
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'cascade'
      })
    }
  }
  Cart.init({
    totalCost: DataTypes.INTEGER,
    totalQty: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};