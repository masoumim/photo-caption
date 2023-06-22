// Import modules and libraries
const express = require("express");

// Import the requests module
const requests = require("../services/requests");

// Require in the utils module
const utils = require("../utils/utils.js");

// Require in the user module
const user = require("./user.js");

// Require in the path module
const path = require('path');

// Require the express-validator library. Used as middleware in routes to check data validity
const { check, validationResult } = require("express-validator");

// Require in the node-cache module used for caching
const nodecache = require('node-cache');

// Create instance of node-cache, stdTTL = number of seconds until cache is deleted. 0 = unlimited
const myCache = new nodecache({ stdTTL: 0 });

// Create the user router
const router = express.Router();

// Key used for node-cache's key/value pair
const key = "getAllImagesCache";

// GET image (/image/:imageId)
router.get("/image/:id", async (req, res) => {
    try {
        // Get the image filename & image id matching imageId parameter
        const image = await requests.getImg(req.params.id);

        // Append the public folder to the image file name
        const imgpath = path.join("/public/", image.filename);

        // Get all of the captions for this image
        const captions = await requests.getCaptionsByImgID(req.params.id);

        // Get all of the users for each caption
        const users = await requests.getUsersByCaptionID(captions);

        // Render page with retrieved image filename and user's captions
        res.status(200).render("image", { image: image, imgpath: imgpath, captions: captions, users: users, id: req.params.id });
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET all images and captions for each image (/images)
router.get("/images", async (req, res) => {
    try {
        if (myCache.has(key)) {
            // CACHE HIT
            // Get the cache data using the key
            const allImagesCache = myCache.get(key);

            // Render page with cached data
            res.status(200).render("images", { images: allImagesCache.images, captions: allImagesCache.captions, users: allImagesCache.users });
        }
        else {
            // CACHE MISS

            // Get all images and image data (comments and users)
            const data = await utils.getAllImageData();

            // Save cache
            myCache.set(key, data);

            // Render page with array of img paths, captions and users
            res.status(200).render("images", { images: data.images, captions: data.captions, users: data.users });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// POST caption (/image/:imageId)
router.post("/image/:id",
    [
        check('comment').not().isEmpty().withMessage('Comment can not be empty'),
        check('comment').isLength({ min: 3 }).withMessage('Comment must be at least 3 characters long')
    ], async (req, res) => {
        try {            
            // If express-validator catches any errors, throw them to catch block
            const errors = validationResult(req).array();
            if (errors.length > 0) {
                throw errors[0].msg;
            }

            // Check if there is an active, authenticated User currently logged in
            if (req.user) {                
                // Get the submitted comment
                const submittedComment = req.body.comment;

                // Add the caption to the db
                await requests.addCaption(submittedComment, req.user.id, parseInt(req.params.id));

                // Update the cache:            
                utils.updateAllImagesCache(key, myCache);

                // Update user data cache:
                utils.updateUserDataCache(req.user.id, user.userDataCache);
                
                // Reload the page to show the new comment
                res.status(201).redirect(req.originalUrl);
            }
            else {
                res.redirect("/");
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

// Export the user router
module.exports = router;