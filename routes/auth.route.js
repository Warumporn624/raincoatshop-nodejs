const express = require('express')
const router = express.Router()

// controller
const {
    register,
    activation,
    showUser,
    editUser,
    deleteUser,
    login, 
    forgotPassword,
    resetPassword,
    currentUser,
     } = require('../controllers/auth.controller')

// middleware
const { auth, adminCheck } = require('../middleware/auth.middleware')

// @Endpoint: http://localhost:5000/api/auth
// @Method: GET
// @Access: publish 
router.get('/auth', showUser)

// @Endpoint: http://localhost:5000/api/register
// @Method: POST
// @Access: publish 
router.post('/register', register)

// @Endpoint: http://localhost:5000/api/login
// @Method: POST
// @Access: publish 
router.post('/login', login)

// @Endpoint: http://localhost:5000/api/forgot
// @Method: POST
// @Access: private 
router.post('/forgot', forgotPassword)

// @Endpoint: http://localhost:5000/api/reset
// @Method: POST
// @Access: private 
router.post('/reset', resetPassword)

// @Endpoint: http://localhost:5000/api/activation
// @Method: POST
// @Access: private 
router.post('/activation', activation)

// @Endpoint: http://localhost:5000/api/current-user
// @Method: POST
// @Access: private 
router.post('/current-user', auth, currentUser)

// @Endpoint: http://localhost:5000/api/current-admin
// @Method: POST
// @Access: private 
router.post('/current-admin', auth, adminCheck, currentUser)

// @Endpoint: http://localhost:5000/api/auth
// @Method: PUT
// @Access: publish 
router.put('/auth', editUser)

// @Endpoint: http://localhost:5000/api/auth
// @Method: DELETE
// @Access: publish 
router.delete('/auth', deleteUser)

module.exports = router