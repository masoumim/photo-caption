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

// GET ALL USERS
const getAllUsers = async () => {
    try {
        const getQuery = await User.findAll();

        // Extract all of the id, name and email from the query result
        let users = [];
        for (const element in getQuery) {
            // Create obj that contains user id, name and email
            const obj = {};
            obj.id = getQuery[element].dataValues.id;
            obj.name = getQuery[element].dataValues.name;
            obj.email = getQuery[element].dataValues.email;
            users.push(obj);
        }
        return users;
    } catch (err) {
        return err;
    }
}

// ADD USER TO DB
const addUser = async (name_, password_, email_) => {
    try {
        // Create an instance of User
        const insertQuery = await User.create({ name: name_, password: password_, email: email_ });
        return insertQuery;
    } catch (err) {
        return err;
    }
}

// GET USER BY NAME
const getUserByName = async (name_) => {
    try {
        const getQuery = await User.findAll({ where: { name: name_ } });
        return getQuery;
    } catch (err) {
        return err;
    }
}

// GET USER BY ID
const getUserByID = async (id_) => {
    try {
        const getQuery = await User.findAll({ where: { id: id_ } });
        return getQuery;
    } catch (err) {
        return err;
    }
}

// GET USER(S) FOR EACH CAPTION ID
const getUsersByCaptionID = async (captions) => {
    try {
        let users = [];
        for (const caption in captions) {
            // Get the user by their id
            const getQuery = await getUserByID(captions[caption].user_id);

            // We only want to add a user once, even if one user has multiple comments,
            // So we check if the user is in the array already
            const isFound = users.some(element => {
                return element.id === getQuery[0].dataValues.id;
            });

            // If user not found, add them to array
            if (!isFound) {
                // Create obj that contains user name and email
                const obj = {};
                obj.id = getQuery[0].dataValues.id;
                obj.name = getQuery[0].dataValues.name;
                obj.email = getQuery[0].dataValues.email;
                users.push(obj);
            }
        }
        return users;
    } catch (err) {
        return err;
    }
}

// ADD IMG File Name to DB
const addImg = async (path, title, date, author, description) => {
    const insertQuery = await Img.create({ img_path: path, img_title: title, img_date: date, img_author: author, img_description: description });
}

// GET ALL IMGS
const getAllImgs = async () => {
    try {
        const getQuery = await Img.findAll();

        // Extract all of the file names from the query result
        let fileNames = [];
        for (const element in getQuery) {
            // Create obj that contains image path (file name) and the image's ID
            const obj = {};
            obj.id = getQuery[element].dataValues.id;
            obj.filename = getQuery[element].dataValues.img_path;
            obj.title = getQuery[element].dataValues.img_title;
            obj.author = getQuery[element].dataValues.img_author;
            obj.date = getQuery[element].dataValues.img_date;
            obj.description = getQuery[element].dataValues.img_description;
            fileNames.push(obj);
        }
        return fileNames;
    } catch (err) {
        return err;
    }
}

// GET IMG BY ID
const getImg = async (id_) => {
    try {
        const getQuery = await Img.findAll({ where: { id: id_ } });
        // Create obj that contains image path (file name) and the image's ID
        const obj = {};
        obj.id = getQuery[0].dataValues.id;
        obj.filename = getQuery[0].dataValues.img_path;
        obj.title = getQuery[0].dataValues.img_title;
        obj.author = getQuery[0].dataValues.img_author;
        obj.date = getQuery[0].dataValues.img_date;
        obj.description = getQuery[0].dataValues.img_description;
        return obj;
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

// GET ALL CAPTIONS
const getAllCaptions = async () => {
    try {
        const getQuery = await Caption.findAll();

        // Extract all of the captions from the query result
        let captions = [];
        for (const element in getQuery) {
            // Create obj that contains caption_text, user_id and img_id
            const obj = {};
            obj.caption_text = getQuery[element].dataValues.caption_text;
            obj.user_id = getQuery[element].dataValues.user_id;
            obj.img_id = getQuery[element].dataValues.img_id;
            captions.push(obj);
        }
        return captions;

    } catch (err) {
        return err;
    }
}

// GET ALL CAPTIONS BY IMAGE ID
const getCaptionsByImgID = async (imgID) => {
    try {
        const getQuery = await Caption.findAll({ where: { img_id: imgID } });

        // Extract all of the captions from the query result
        let captions = [];
        for (const element in getQuery) {
            // Create obj that contains caption_text, user_id and img_id
            const obj = {};
            obj.caption_text = getQuery[element].dataValues.caption_text;
            obj.user_id = getQuery[element].dataValues.user_id;
            obj.img_id = getQuery[element].dataValues.img_id;
            captions.push(obj);
        }
        return captions;

    } catch (err) {
        return err;
    }
}

// GET ALL CAPTIONS BY USER ID
const getCaptionsByUserID = async (userID) => {
    try {
        const getQuery = await Caption.findAll({ where: { user_id: userID } });

        // Extract all of the captions from the query result
        let captions = [];
        for (const element in getQuery) {
            // Create obj that contains caption_text, user_id and img_id
            const obj = {};
            obj.caption_text = getQuery[element].dataValues.caption_text;
            obj.user_id = getQuery[element].dataValues.user_id;
            obj.img_id = getQuery[element].dataValues.img_id;
            captions.push(obj);
        }
        return captions;
    } catch (err) {
        return err;
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUserByName,
    getUserByID,
    getUsersByCaptionID,
    getAllImgs,
    getImg,
    addCaption,
    getAllCaptions,
    getCaptionsByImgID,
    getCaptionsByUserID
}