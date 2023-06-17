// Require in the dotenv module
// Will load environment variables contained in .env file
require('dotenv').config();

// Export the credentials to connect to the db
module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
      ssl: { rejectUnauthorized: false }
    }
  }
};