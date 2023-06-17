// Import modules and libraries
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

// Import the requests module
const requests = require("../services/requests");

// Create the user router
const router = express.Router();


// *** ROUTES ***

// GET HOME
// Redirect to login
router.get("/", (req, res) => {
    res.redirect("/login");
});

// GET the login page
router.get("/login", (req, res) => {
    res.render("login");
});

// GET PROFILE
router.get("/profile", (req, res) => {
    if (req.user) {
        // Render the profile ejs page
        // Pass the user object stored in session to the page                  
        res.render("profile", { user: req.user });
    } else {
        res.redirect("/login");
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
        res.redirect('/login');
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
                res.status(201).send(`User registered: ${resultUser.dataValues.name}`);
            } else {
                // Send correct response if new user failed to be created:
                res.status(500).json({ msg: "Error: not able to register user" });
            }
        }
        else {
            res.status(500).send("Sorry a user with that name is already registered.");
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
router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("profile");
});

// Export the user router
module.exports = router;