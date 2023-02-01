const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const lineNotify = require('line-notify-nodejs')(process.env.LINE_TOKEN);

// Models
const User = require('../models/User.model')
const Product = require('../models/Product.model')
const Cart = require('../models/Cart.model')
const Order = require('../models/Order.model')
const Payment = require('../models/Payment.model')



exports.listUsers = async (req, res) => {
    try {
        const user = await User.find({}).select('-password').exec();
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.readUsers = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({ _id: id }).select('-password').exec()
        res.send(user)

    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.updateUsers = async (req, res) => {
    try {
        res.send('hello update users')

    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.removeUsers = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOneAndDelete({ _id: id })
        res.send('hello remove users')

    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.changeEnabled = async (req, res) => {
    try {
        const id = req.body.id
        const enabled = req.body.enabled
        const user = await User.findOneAndUpdate({ _id: id }, { enabled: enabled });
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}


exports.changeRole = async (req, res) => {
    try {
        const id = req.body.id
        const role = req.body.role
        const user = await User.findOneAndUpdate({ _id: id }, { role: role });
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}

exports.userCart = async (req, res) => {
    try {
        const { cart } = req.body
        let user = await User.findOne({ email: req.user.email }).exec();
        let products = [];
        let prevCart = await Cart.findOne({ orderedBy: user._id }).exec();
        if (prevCart) {
            prevCart.remove()
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {}

            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.price = cart[i].price;

            products.push(object)
        }

        let cartPriceTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartPriceTotal = cartPriceTotal + products[i].price * products[i].count
        }

        let cartNumberTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartNumberTotal = cartNumberTotal + products[i].count * 1
        }

        let newCart = await new Cart({
            products,
            cartPriceTotal,
            cartNumberTotal,
            orderedBy: user._id
        }).save();

        // console.log(newCart);

        res.send('userCart pass')
    } catch (error) {
        console.log(error)
        res.status(500).send('User cart server error')
    }
}

exports.getUserCart = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        let cart = await Cart.findOne({ orderedBy: user._id }).populate('products.product').exec();
        const { products, cartPriceTotal, cartNumberTotal } = cart;
        res.json({ products, cartPriceTotal, cartNumberTotal });
    } catch (error) {
        console.log(error)
        res.status(500).send('get user cart server error')
    }
}

exports.emptyCart = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        const empty = await Cart.findOneAndRemove({ orderedBy: user._id }).exec()
        res.send(empty);

    } catch (error) {
        console.log(error)
        res.status(500).send('removeUserCart server error')
    }
}

exports.getInformAddress = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        const address = user.informAddress
        res.send(address);
    } catch (error) {
        console.log(error)
        res.status(500).send('getInformAddress server error')
    }
}

exports.saveInformAddress = async (req, res) => {
    try {
        const userInformAddress = await User.findOneAndUpdate(
            { email: req.user.email },
            { informAddress: req.body.informAddress }).exec();
        // res.send("หลังบ้าน"+ req.body.informAddress)
        res.json({ pass: true });
    } catch (error) {
        console.log(error)
        res.status(500).send('saveInformAddress server error')
    }
}

exports.saveOrder = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

        let order = await new Order({
            products: userCart.products,
            orderedBy: user._id,
            cartPriceTotal: userCart.cartPriceTotal,
            orderPriceTotal: userCart.cartPriceTotal + 50,
            cartNumberTotal: userCart.cartNumberTotal,
            shippingAddress:user.informAddress
        }).save()

        let bulkOption = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                }
            }
        })

        let updated = await Product.bulkWrite(bulkOption, {})

        res.send(updated);

        date =  new Date(order.createdAt)

        //   https://notify-bot.line.me/my/
        lineNotify.notify({
            message: "คุณได้รับคำสั่งซื้อใหม่ เลขที่คำสั่งซื้อ: "+ order.numberInvoice + "\n" + "เวลาสร้าง: " + date.toUTCString()
          }).then(() => {
            console.log('send completed!');
          });

    } catch (error) {
        console.log(error)
        res.status(500).send('save Order server error')
    }
}


exports.getOrder = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        let order = await Order.find({ orderedBy: user._id }).populate('products.product').exec();
        res.json(order);
    } catch (error) {
        console.log(error)
        res.status(500).send('getOrder server error')
    }
}

// wishlist
exports.addWishList = async (req, res) => {
    try {
        const { productId } = req.body
        let user = await User.findOneAndUpdate(
            { email: req.user.email },
            { $addToSet: { wishlist: productId } }
        ).exec()
        res.send(user.wishlist)

    } catch (error) {
        console.log(error)
        res.status(500).send('addWishList server error')
    }
}

exports.getWishList = async (req, res) => {
    try {
        const list = await User
            .findOne({ email: req.user.email })
            .select('wishlist')
            .populate('wishlist')
            .exec()

        res.json(list);

    } catch (error) {
        console.log(error)
        res.status(500).send('getWishList server error')
    }
}

exports.removeWishList = async (req, res) => {
    try {
        const { productId } = req.params
        let user = await User.findOneAndUpdate(
            { email: req.user.email },
            { $pull: { wishlist: productId } }
        ).exec()

        res.send(user)

    } catch (error) {
        console.log(error)
        res.status(500).send('removeWishList server error')
    }
}

exports.getInvoice = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        let order = await Order.find({ orderedBy: user._id }).findOne({ _id: req.params.id }).populate('products.product').exec();
        res.json(order);
    } catch (error) {
        console.log(error)
        res.status(500).send('getOrder server error')
    }
}

exports.createPayment = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        const idInvoice = await Order.findOne({ _id: req.body.idInvoice }).exec();

        // console.log(req.body)
        const payment = await new Payment({
            PayBy:user._id,
            paymentDate:req.body.paymentDate,
            order:idInvoice._id,
            amount:req.body.amount,
            transactionFrom:req.body.transactionFrom,
            transactionTo:req.body.transactionTo,
            images:req.body.images,
        }).save();

        res.json(payment)

        const order = await Order.findOneAndUpdate({ _id: req.body.idInvoice }, { orderStatus: "รอตรวจสอบการชำระเงิน" });
    } catch (error) {
        console.log(error)
        res.status(500).send('payment error!')
    }
}




