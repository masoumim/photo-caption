// Import modules and libraries
const express = require("express");

// Import the requests module
const requests = require("../services/requests");

// Require in the path module
const path = require('path');

// Create the user router
const router = express.Router();


// *** ROUTES ***

// GET image (/image/:imageId)
router.get("/image/:id", async (req, res) => {
    try {
        // Get the image filename & image id matching imageId parameter
        const image = await requests.getImg(req.params.id);

        // Append the public folder to the image file name
        const imgpath = path.join("/public/", image);

        // Get all of the captions for this image
        const captions = await requests.getCaptionsByImgID(req.params.id);

        // Get all of the users for each caption
        const users = await requests.getUsersByCaptionID(captions);

        // Render page with retrieved image filename and user's captions
        res.render("image", { image: imgpath, captions: captions, users: users });
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET all images and captions for each image (/images)
router.get("/images", async (req, res) => {
    try {
        // Get all of the img paths stored in DB
        const images = await requests.getAllImgs();

        // Get all of the captions stored in DB
        const captions = await requests.getAllCaptions();

        // Get all of the users stored in the DB
        const users = await requests.getAllUsers();
               
        // Render page with array of img paths, captions and users
        res.render("images", { images: images, captions: captions, users: users});
    } catch (err) {
        res.status(500).send(err);
    }
});



//TODO: POST caption (/images/:imageId)
// check if user is logged in or not by using middleware


// Export the user router
module.exports = router;