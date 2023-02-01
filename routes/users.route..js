const express = require('express')
const router = express.Router()

// controller
const { 
    listUsers, 
    readUsers, 
    updateUsers, 
    removeUsers,
    changeEnabled,
    changeRole,
    userCart,
    getUserCart,
    saveInformAddress,
    getInformAddress,
    saveOrder,
    emptyCart,
    addWishList,
    getWishList,
    removeWishList,
    getOrder,
    getInvoice,
    createPayment
} = require('../controllers/users.controller')

// middleware
const { auth, adminCheck } = require('../middleware/auth.middleware')


// @Endpoint: http://localhost:5000/api/users
// @Method: GET
// @Access: private 
router.get('/users', auth, adminCheck, listUsers);

// @Endpoint: http://localhost:5000/api/users/:id
// @Method: GET
// @Access: private 
router.get('/users/:id', readUsers);

// @Endpoint: http://localhost:5000/api/users/:id
// @Method: PUT
// @Access: private 
router.put('/users/:id', updateUsers);

// @Endpoint: http://localhost:5000/api/users/:id
// @Method: DELETE
// @Access: private 
router.delete('/users/:id', removeUsers);

// @Endpoint: http://localhost:5000/api/change-enabled
// @Method: POST
// @Access: private 
router.post('/change-enabled',auth, adminCheck, changeEnabled);

// @Endpoint: http://localhost:5000/api/change-enabled
// @Method: POST
// @Access: private 
router.post('/change-role',auth, adminCheck, changeRole);

// @Endpoint: http://localhost:5000/api/user/cart
// @Method: POST/GET
// @Access: private 
router.post('/user/cart',auth, userCart);
router.get('/user/cart',auth, getUserCart);
router.delete('/user/cart',auth, emptyCart);

router.post('/user/informAddress',auth, saveInformAddress);
router.get('/user/informAddress',auth, getInformAddress);

router.post('/user/order',auth, saveOrder);
router.get('/user/orders',auth, getOrder);

//wishlist
router.post('/user/wishlist',auth, addWishList);
router.get('/user/wishlist',auth, getWishList);
router.put('/user/wishlist/:productId',auth, removeWishList);

router.get('/user/invoice/:id',auth, getInvoice);

router.post('/user/payment', auth, createPayment);


module.exports = router


