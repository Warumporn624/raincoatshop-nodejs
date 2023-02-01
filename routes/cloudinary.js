const express = require('express')
const router = express.Router()

// controller
const {
createImage,
removeImage
     } = require('../controllers/cloudinary.controller')

// middleware
const { auth } = require('../middleware/auth.middleware')


// @Endpoint: http://localhost:5000/api/images
router.post('/images', auth, createImage);
router.post('/removeimages', auth, removeImage);

module.exports = router;