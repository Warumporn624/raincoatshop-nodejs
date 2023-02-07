const express = require('express')
const router = express.Router()

// controller
const {
    list,
    create,
    read,
    update,
    remove
     } = require('../controllers/category.controller')

// middleware
const { auth, adminCheck } = require('../middleware/auth.middleware')


// @Endpoint: http://localhost:5000/api/category
// @Method: GET, POST, PUT, DELETE
router.get('/category', list);

router.post('/category', auth, adminCheck, create);

router.get('/category/:id', auth, adminCheck, read);

router.put('/category/:id', auth, adminCheck, update);

router.delete('/category/:id', auth, adminCheck, remove);


module.exports = router;  