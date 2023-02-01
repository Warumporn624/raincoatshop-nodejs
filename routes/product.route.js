const express = require('express')
const router = express.Router()

// controller
const {
    create,
    list,
    remove,
    read,
    update,
    listBy,
    searchFilters,
    listColor
     } = require('../controllers/product.controller')

// middleware
const { auth, adminCheck } = require('../middleware/auth.middleware')


// @Endpoint: http://localhost:5000/api/product
router.post('/product', auth, adminCheck, create);
router.get('/product/:count', list);
router.delete('/product/:id', auth, adminCheck, remove);

// Update Product
// @Endpoint: http://localhost:5000/api/products
router.get('/products/:id', read);
router.put('/product/:id', auth, adminCheck, update);

router.post('/productby', listBy);

// Search
router.post('/search/filters', searchFilters);

//list color
router.get('/product-color', listColor);

module.exports = router; 