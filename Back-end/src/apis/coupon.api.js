const couponApi = require('express').Router();
const couponController = require('../controllers/coupon.controller');

couponApi.get('/', couponController.getCoupons);
couponApi.post('/', couponController.createCoupon);
couponApi.delete('/', couponController.deleteCoupon);
couponApi.get('/check', couponController.checkCoupon);

module.exports = couponApi;