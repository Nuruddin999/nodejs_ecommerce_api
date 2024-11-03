'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductFile, {
        foreignKey: 'productId',
        onDelete: 'cascade'
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    selfPrice: DataTypes.NUMBER,
    price: DataTypes.NUMBER,
    category: DataTypes.STRING,
    mainThumbUrl: DataTypes.STRING,
    mainThumbType: DataTypes.STRING,
    description: DataTypes.TEXT,
    isForStartPage: DataTypes.BOOLEAN,
    handle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};