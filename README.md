# photo-caption
A web app that lets users caption and comment on famous photos. Built using ExpressJS and NodeJS.

**NOTE: (November 20, 2023) This project has been removed from Heroku / Heroku PostgreSQL hosting**

~~App Link: https://photo-caption-cd9b50c22ff8.herokuapp.com~~

# Project technical stack:

**Language:** Node.js / JavaScript

**Framework:** Express.js

**Database:** PostgreSQL / Heroku

**Passport.js:** Authentication middleware for Node.js, used for authenticating users at login

**bcrypt:** A password-hashing function, used to hash and salt plaintext passwords before they are saved to database

**dotenv:** Loads environment variables from .env file, used for storing database connection string and cookie secret

**Sequelize:** An ORM used for interacting with Database

**Express-Session:** Session middleware for Express, used for creating user login sessions and sending secure cookie to client

**Connect-pg-simple:** A minimal PostgreSQL session store for Connect/Express, used to save user session data

**EJS Template Engine:** A simple templating language that lets you generate HTML markup with plain JavaScript

**Node-cache:** Simple and fast NodeJS internal caching.

**Express-validator:** A set of express.js middlewares that wraps the extensive collection of validators and sanitizers offered by validator.js

**Helmet:** Secures Express apps by setting HTTP response headers to comply with web security standards

# Project info:
This project is a web app that allows users to securely login and leave captions or comments on some of the worlds most famous (and infamous) photographs.


# Security
Login and registration is secured using password hashing. Sessions are secure and persistent using secure cookies. HTTP headers are set using the Helmet library and are automatically set by the library to ensure the headers conform to web security standards. User input is also validated and sanitized by using the Express-validator library. Finally, SQL injection opportunities are minimized by using a secure ORM, Sequelize.


# OpenAPI / Swagger
A full API specification is included in this repository (openAPI_documentation.yaml)

To view the .yaml file using Swagger, first download the Swagger editor from the Swagger GitHub repo (https://github.com/swagger-api/swagger-editor) OR you can use the browser based Swagger editor at (https://editor.swagger.io/)

If you downloaded the Swagger editor, simply open the index.html file located in folder. From there you can import the .yaml file by going to FILE > IMPORT FILE.

# Endpoints:


~~Base URL: https://photo-caption-cd9b50c22ff8.herokuapp.com~~

Home Page
------
**Get:**
  
/ -- Gets the homepage which contains a login form


**Post:**
  
/ - Posts username and password and redirects user to their profile page


Images
-----------
**Get:**
  
/images -- GETS all images from the DB including user comments


Profile
-----------
**Get:**

/profile -- Authenticated users will get a profile page containing all the photos they commented on


Image
-----------
**Get:**

/image/:id -- Gets an individual image and its comments along with an input field for users to leave comments

**Post:**

/image/:id -- Makes a post request using the users comment which is saved to the DB


Register
-----------
**Get:**

/register -- Gets the registration page which has a simple registration form

**Post:**

/register -- Posts the users registration info to the server which is saved to the DB


Logout
-----------
**Get:**

/logout -- Logs the user out of the website and ends their session

