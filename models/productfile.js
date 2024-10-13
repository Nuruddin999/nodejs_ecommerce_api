'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductFile.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      })
    }
  }
  ProductFile.init({
    url: DataTypes.STRING,
    type: DataTypes.STRING,
    productId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductFile',
  });
  return ProductFile;
};