const Order = require('../models/Order.model');
const Payment = require('../models/Payment.model');

exports.getOrderAdmin = async (req, res) => {
    try {
        let order = await Order.find()
        .populate('products.product')
        .populate('orderedBy', 'email')
        .exec();
        res.json(order);
    } catch (error) {
        console.log(error)
        res.status(500).send('getOrderAdmin server error')
    }
}

exports.changeOrderStatus = async (req, res) => {
    try {
        const id = req.body.id
        const orderStatus = req.body.orderStatus
        const order = await Order.findOneAndUpdate({ _id: id }, { orderStatus: orderStatus });
        res.send(order)
    } catch (error) {
        console.log(error)
        res.status(500).send('changeOrderStatus error')
    }
}

exports.getPayment = async (req, res) => {
    try {
        let payment = await Payment.find()
        .populate('PayBy', 'email')
        .populate({
            path: 'order',
            match: {
              orderStatus: 'รอตรวจสอบการชำระเงิน'
            }})
        .exec()

        var rpay =  payment.filter(function(x) {
            return x.order !== null;
          });
    
        res.json(rpay);
    } catch (error) {
        console.log(error)
        res.status(500).send('getPayment server error')
    }
}

exports.searchOrders = async (req, res) => {
    try {
        const query = req.body.search
        console.log("query", query)
        let order = await Order.find({ numberInvoice: {$regex: '.*'+query+'.*'}})
        .populate('products.product')
        .populate('orderedBy', 'email')
        .exec();
        res.json(order);
    } catch (error) {
        console.log(error)
        res.status(500).send('searchOrders server error')
    }
}

exports.updateTrackingNumber = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ _id: req.body.id }, { tracking: req.body.tracking }).exec();
        res.send(order)
    } catch (error) {
        console.log(error)
        res.status(500).send('updateTrackingNumber error')
    }
 }