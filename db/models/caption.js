// 'use strict';
// const {
//   Model
// } = require('sequelize');
// const user = require('./user');
// const img = require('./img');
// module.exports = (sequelize, DataTypes) => {
//   class Caption extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   caption.init({
//     caption_text: { type: DataTypes.STRING, allowNull: false },
//     // foreign keys:
//     user_id: { type: DataTypes.INTEGER, references: { model: user, key: 'id' }, allowNull: false },
//     img_id: { type: DataTypes.INTEGER, references: { model: img, key: 'id' }, allowNull: false }
//   }, {
//     sequelize,
//     modelName: 'caption',
//   });
//   return Caption;
// };

// Require in the dotenv module
// Will load environment variables contained in .env file
require('dotenv').config();

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL,
  {
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true, ssl: { rejectUnauthorized: false }
    }
  });

class Caption extends Model { }

Caption.init({
  // Model attributes are defined here
  caption_text: { type: DataTypes.STRING, allowNull: false }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Caption', // We need to choose the model name
  tableName: 'caption'  // Specify the table name
});

module.exports = { Caption };