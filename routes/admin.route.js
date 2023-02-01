const express = require('express')
const router = express.Router()

const { 
    getOrderAdmin,
    getPayment,
    changeOrderStatus,
    searchOrders,
    updateTrackingNumber
} = require('../controllers/admin.controller')

// middleware
const { auth, adminCheck } = require('../middleware/auth.middleware')

router.get('/admin/orders', auth, adminCheck, getOrderAdmin);
router.post('/admin/orders', auth, adminCheck, searchOrders);
router.get('/admin/check-payment', auth, adminCheck, getPayment);

router.post('/change-order-status', auth, adminCheck, changeOrderStatus);
router.post('/change-tracking', auth, adminCheck, updateTrackingNumber);

module.exports = router
