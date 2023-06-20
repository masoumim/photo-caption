// Import modules and libraries
const express = require("express");

// Import the passport module
const passport = require("passport");

// Import the requests module
const requests = require("../services/requests");

// Require in the path module
const path = require('path');

// Require in the node-cache module used for caching
const nodecache = require('node-cache');

// Create instance of node-cache, stdTTL = number of seconds until cache is deleted. 0 = unlimited
const myCache = new nodecache({stdTTL: 0});

// Create the user router
const router = express.Router();

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
        res.render("image", { image: image, imgpath: imgpath, captions: captions, users: users, id: req.params.id });
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET all images and captions for each image (/images)
router.get("/images", async (req, res) => {
    const key = "getAllImagesCache"; // Key used for node-cache's key/value pair
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
            // Get all of the img paths stored in DB
            const images = await requests.getAllImgs();

            // Get all of the captions stored in DB
            const captions = await requests.getAllCaptions();

            // Get all of the users stored in the DB
            const users = await requests.getAllUsers();

            // Store all data in single object to be saved to cache
            const data = { images, captions, users };

            // Save cache
            myCache.set(key, data);

            // Render page with array of img paths, captions and users
            res.status(200).render("images", { images: images, captions: captions, users: users });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});


// POST caption (/image/:imageId)
/*
Pass in passport.authenticate() as middleware. 
Using this middleware allows Passport.js to take care of the authentication 
process behind the scenes and creates a user session for us.
If successful, the user will be Serialized
*/
router.post("/image/:id", async (req, res) => {
    try {
        // Check if there is an active, authenticated User currently logged in
        if (req.user) {
            // Get the submitted comment
            const submittedComment = req.body.comment;

            // Add the caption to the db
            await requests.addCaption(submittedComment, req.user.id, parseInt(req.params.id));

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