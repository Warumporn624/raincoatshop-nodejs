const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
 
    PayBy:{
        type:ObjectId,
        ref:'users'
    },

    paymentDate:Date, 
    
    order:{
        type:ObjectId,
        ref:'order'
    },

    amount:Number,
    transactionFrom:String,
    transactionTo:String,

    images: {
        type: Array,
    }

}, { timestamps: true });


module.exports = Payment = mongoose.model('payment', PaymentSchema);