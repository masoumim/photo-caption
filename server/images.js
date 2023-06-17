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

        // Render page with retrieved image filename
        res.render("image", { image: imgpath });
    } catch (err) {
        res.send(err);
    }
});

// GET all images and captions for each image (/images)
router.get("/images", async (req, res) => {
    // Get all of the img paths stored in DB
    const images = await requests.getAllImgs();
    
    // Get all of the captions stored in DB
    
    // Render page with array of img paths and array of captions
    res.render("images", { images: images });
});



//TODO: POST caption (/images/:imageId)
// check if user is logged in or not by using middleware


// Export the user router
module.exports = router;