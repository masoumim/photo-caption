// Import the requests module
const requests = require("../services/requests");

// Updates the cache that stores user data (images + comments by a single user)
// Called when a user adds a comment to a photo
const updateUserDataCache = async (userID, cache) => {
    // Get User captions:
    const userCaptions = await requests.getCaptionsByUserID(userID);

    // Get images that have a comment by user
    const imagesWithUserComment = await getImagesWithUserComment(userCaptions);

    // Update cache
    const key = "getUserData:" + userID; // Key used for node-cache's key/value pair
    const data = { imagesWithUserComment, userCaptions };
    cache.set(key, data);
}

// Updates the cache that stores all images, comments and users
// Called when a user adds a comment to a photo
const updateAllImagesCache = async (key, cache) => {

    // Get all images and image data (comments and users)
    const data = await getAllImageData();

    // Update the cache
    cache.set(key, data);
}

// Returns an array of images which have a comment by a specific user
const getImagesWithUserComment = async (userCaptions) => {
    let imagesWithUserComment = [];

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
    return imagesWithUserComment;
}

// Returns an object that contains all images + image data (comments and users)
const getAllImageData = async () => {
    // Get all of the img paths stored in DB
    const images = await requests.getAllImgs();

    // Get all of the captions stored in DB
    const captions = await requests.getAllCaptions();

    // Get all of the users stored in the DB
    const users = await requests.getAllUsers();

    // Store all data in single object to be saved to cache
    const data = { images, captions, users };

    // Return the data
    return data;
}

module.exports = {
    updateAllImagesCache, updateUserDataCache, getImagesWithUserComment, getAllImageData
}