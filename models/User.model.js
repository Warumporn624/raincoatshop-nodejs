const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  enabled: {
    type: Boolean,
    default: true
  },
  informAddress: {
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
  wishlist:[{
    type: ObjectId,
    ref: 'product'
  }]

}, { timestamps: true });

module.exports = User = mongoose.model('users', UserSchema);