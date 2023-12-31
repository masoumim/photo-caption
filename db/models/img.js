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

class Img extends Model { }

Img.init({
  // Model attributes are defined here
  img_path: { type: DataTypes.STRING, allowNull: false },
  img_title: { type: DataTypes.STRING, allowNull: false },
  img_description: { type: DataTypes.STRING, allowNull: false },
  img_date: { type: DataTypes.STRING, allowNull: false },
  img_author: { type: DataTypes.STRING, allowNull: false }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Img', // We need to choose the model name
  tableName: 'img'  // Specify the table name
});

module.exports = { Img };