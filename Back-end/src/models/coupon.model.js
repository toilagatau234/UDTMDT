const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, trim: true }, // Mã code (VD: SAVE20)
  discount: { type: Number, required: true, min: 0, max: 100 }, // % giảm giá
  usageLimit: { type: Number, required: true, default: 1 }, // Số lượt sử dụng còn lại
  expireDate: { type: Date, required: true }, // Hạn sử dụng
  created: { type: Date, default: Date.now },
});

const CouponModel = mongoose.model('coupon', couponSchema, 'coupons');

module.exports = CouponModel;