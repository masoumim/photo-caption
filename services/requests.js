// Require in the dotenv module
// Will load environment variables contained in .env file
require('dotenv').config();

// Require in Sequelize 
const { Sequelize } = require('sequelize');

// Get the User model
const { User } = require('../db/models/user.js');

// Get the Img model
const { Img } = require('../db/models/img.js');

// Get the Caption model
const { Caption } = require('../db/models/caption.js');

// Create new sequelize connection to the db
const sequelize = new Sequelize(process.env.DATABASE_URL,
    {
        dialect: 'postgres',
        dialectOptions: {
            bigNumberStrings: true, ssl: { rejectUnauthorized: false }
        }
    });

// ADD USER TO DB
const addUser = async (name_, password_, email_) => {
    // Create an instance of User
    const insertQuery = await User.create({ name: name_, password: password_, email: email_ });
    return insertQuery;
}

// GET USER BY NAME
const getUserByName = async (name_) => {
    const getQuery = await User.findAll({ where: { name: name_ } });
    return getQuery;
}

// GET USER BY ID
const getUserById = async (id_) => {
    const getQuery = await User.findAll({ where: { id: id_ } });
    return getQuery;
}

// ADD IMG File Name to DB
const addImg = async (img_path_) => {
    const insertQuery = await Img.create({ img_path: img_path_ });
}

// GET ALL IMGS
const getAllImgs = async () => {
    const getQuery = await Img.findAll();

    // Extract all of the file names from the query result
    let fileNames = [];
    for (const element in getQuery) {
        // Create obj that contains image path (file name) and the image's ID
        const obj = {};
        obj.id = getQuery[element].dataValues.id;
        obj.filename = getQuery[element].dataValues.img_path;
        fileNames.push(obj);
    }
    return fileNames;
}

// GET IMG BY ID
const getImg = async (id_) => {
    try {
        const getQuery = await Img.findAll({ where: { id: id_ } });
        const fileName = getQuery[0].dataValues.img_path;
        return fileName;
    } catch (err) {
        throw "Sorry, that image doesn't exist";
    }
}

// ADD A CAPTION
const addCaption = async (caption, userId, imgId) => {
    try {
        const insertQuery = await Caption.create({ caption_text: caption, user_id: userId, img_id: imgId });        
        return insertQuery;
    } catch (err) {
        return err;
    }
}

// addCaption("I love this cat!", 3, 4);
// addCaption("Best cat ever!", 3, 2);
// addCaption("Very cute!", 4, 4);
// addCaption("Being a cat must be nice :)", 4, 3);

// GET ALL CAPTIONS
const getAllCaptions = async () => {
    try {
        const getQuery = await Caption.findAll();
        console.log(getQuery);
        return getQuery;

    } catch (err) {
        return err;
    }
}

// getAllCaptions();

module.exports = { addUser, getUserByName, getUserById, getAllImgs, getImg }