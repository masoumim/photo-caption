// Import modules and libraries
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

// Import the requests module
const requests = require("../services/requests");

// Require in the node-cache module used for caching
const nodecache = require('node-cache');

// Create instance of node-cache 
// stdTTL = number of seconds until cache is deleted. Set to 1hr.
const userDataCache = new nodecache({ stdTTL: 3600 });

// Create the user router
const router = express.Router();

// GET HOME
router.get("/", (req, res) => {
    // If user is logged in - render their profile
    if (req.user) {        
        res.redirect("/profile");
    }
    else {
        // Otherwise, render home / index        
        res.render("index");
    }
});

// GET PROFILE
router.get("/profile", async (req, res) => {
    if (req.user) {
        try {
            const key = "getUserData:" + req.user.id; // Key used for node-cache's key/value pair            
            if (userDataCache.has(key)) {                
                // CACHE HIT - Load data from cache
                const userDataFromCache = userDataCache.get(key);

                // Render user profile with cached data
                res.render("profile", { user: req.user, images: userDataFromCache.imagesWithUserComment, captions: userDataFromCache.userCaptions });
            } else {                
                // CACHE MISS - Load data from DB
                // If user is logged in, render profile including pictures and comments made by user
                let imagesWithUserComment = []; // Array to store images with comments made by user

                // Get User captions:
                const userCaptions = await requests.getCaptionsByUserID(req.user.id);

                // Get corresponding images:
                if (userCaptions.length > 0) {
                    for (element in userCaptions) {
                        const image = await requests.getImg(userCaptions[element].img_id);

                        // We only want to add an image once, even if one user has multiple comments on one image
                        // Check if the image is in the array already
                        const isFound = imagesWithUserComment.some(element => {
                            return element.id === image.id;
                        });

                        // If image not found, add it to array
                        if (!isFound) {
                            imagesWithUserComment.push(image);
                        }
                    }
                }
                // Save cache
                const data = { imagesWithUserComment, userCaptions };
                userDataCache.set(key, data);

                // Render the profile page with user data from DB
                res.render("profile", { user: req.user, images: imagesWithUserComment, captions: userCaptions });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        // If user isn't logged in, render the index page
        res.redirect("/");
    }
});

// GET REGISTER
router.get("/register", (req, res) => {
    res.render("register");
});

// GET LOGOUT
// Passport.js exposes a logout function within the request object: req.logout. 
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// POST REGISTER:
router.post("/register", async (req, res) => {
    try {     
        // Get username and password from the request body
        const { username, password, email } = req.body;

        // Check if a user with that name already exists in the db
        const userCheck = await requests.getUserByName(username);

        if (userCheck.length === 0) {
            // Hash the user's password:
            // 1. Generate salt with 10 Salt Rounds
            const salt = await bcrypt.genSalt(10);

            // 2. Hash password
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user:
            const resultUser = await requests.addUser(username, hashedPassword, email);

            // Add if/else statement with the new user as the condition:
            if (resultUser) {
                // Send correct response if new user is created:
                res.status(201).redirect("/");
            } else {
                // Send correct response if new user failed to be created:
                res.status(500).json({ msg: "Error: not able to register user" });
            }
        }
        else {
            res.status(500).send("Sorry, please enter a valid user name");
        }

    } catch (error) {
        res.status(500).send(`${error}`);
    }
});

/*
Pass in passport.authenticate() as middleware. 
Using this middleware allows Passport.js to take care of the authentication 
process behind the scenes and creates a user session for us.
If successful, the user will be Serialized
*/
// POST LOGIN
router.post("/", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
    res.redirect("profile");
});

// Export the user router
module.exports = router;