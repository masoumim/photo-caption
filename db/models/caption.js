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
  caption_text: { type: DataTypes.STRING, allowNull: false },
  user_id: {type: DataTypes.INTEGER, allowNull: false},
  img_id: {type: DataTypes.INTEGER, allowNull: false}
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Caption', // We need to choose the model name
  tableName: 'caption'  // Specify the table name
});

module.exports = { Caption };