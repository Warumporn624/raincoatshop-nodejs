const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    sku: {
        type: String,
    },
    color: {
        type: String,
    },
    title: {
        type: String,
        text:true
    },
    description: {
        type: String,
    },

    // ------ref----------
    category: {
        type: ObjectId,
        ref:'category',
    },
    // ----------------

    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default:0
    },
    images: {
        type: Array,
    },

}, { timestamps: true });

module.exports = Product = mongoose.model('product', ProductSchema);