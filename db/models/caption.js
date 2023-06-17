'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
const img = require('./img');
module.exports = (sequelize, DataTypes) => {
  class Caption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  caption.init({
    caption_text: { type: DataTypes.STRING, allowNull: false },
    // foreign keys:
    user_id: { type: DataTypes.INTEGER, references: { model: user, key: 'id' }, allowNull: false },
    img_id: { type: DataTypes.INTEGER, references: { model: img, key: 'id' }, allowNull: false }
  }, {
    sequelize,
    modelName: 'caption',
  });
  return Caption;
};