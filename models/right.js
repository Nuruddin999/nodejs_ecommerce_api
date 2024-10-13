'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Right extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Right.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  Right.init({
    entity: DataTypes.STRING,
    create: DataTypes.BOOLEAN,
    read: DataTypes.BOOLEAN,
    update: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Right',
  });
  return Right;
};