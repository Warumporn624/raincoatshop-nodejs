const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;
const mongooseSerial = require("mongoose-serial")

const OrderSchema = new mongoose.Schema({
 
    numberInvoice: String,
    products:[
        {
            product:{
                type:ObjectId,
                ref:'product'
            },
            count:Number,
            price:Number,
        }
    ],
    cartPriceTotal:Number,
    cartNumberTotal:Number, 
    orderPriceTotal:Number, 
    orderStatus:{
        type:String,
        default:'ที่ต้องชำระ'
    },
    tracking:{
        type:String,
        default:''
    },
    orderedBy:{
        type:ObjectId,
        ref:'users'
    },
    shippingAddress: {
        address: String,
        district: String,
        email: String,
        nameUser: String,
        note: String,
        postcode: String,
        province: String,
        subDistrict: String,
        tel: String,
      },

}, { timestamps: true });

OrderSchema.plugin(mongooseSerial, { field:"numberInvoice", prefix:"AUR", separator: ""});

module.exports = Order = mongoose.model('order', OrderSchema);