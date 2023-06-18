// Import modules and libraries
const express = require("express");

// Import the requests module
const requests = require("../services/requests");

// Create the user router
const router = express.Router();


// *** ROUTES ***


// GET ALL CAPTIONS
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

// Export the user router
module.exports = router;