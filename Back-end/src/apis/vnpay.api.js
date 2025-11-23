const vnpayApi = require('express').Router();
const vnpayController = require('../controllers/vnpay.controller');

// API tạo URL thanh toán
vnpayApi.post('/create_payment_url', vnpayController.createPaymentUrl);

// API VNPay gọi khi thanh toán xong (để redirect)
vnpayApi.get('/vnpay_return', vnpayController.vnpayReturn);

// API VNPay gọi ngầm để cập nhật DB
vnpayApi.get('/vnpay_ipn', vnpayController.vnpayIpn);

module.exports = vnpayApi;

// const { VNPay } = require('vn-payments');
// const express = require('express');
// const VNPayApi = express.Router();

// /* eslint-disable no-param-reassign */
// const TEST_CONFIG = VNPay.TEST_CONFIG;
// const vnpay = new VNPay({
// 	paymentGateway: TEST_CONFIG.paymentGateway,
// 	merchant: TEST_CONFIG.merchant,
// 	secureSecret: TEST_CONFIG.secureSecret,
// });


// VNPayApi.post('/payment/checkout', async (req, res) => {
//   const checkoutData = res.locals.checkoutData;

// 	checkoutData.returnUrl = `http://${req.headers.host}/payment/vnpay/callback`;
// 	checkoutData.orderInfo = 'Thanh toan giay adidas';
// 	checkoutData.orderType = 'fashion';

// 	return vnpay.buildCheckoutUrl(checkoutData).then(checkoutUrl => {
// 		res.locals.checkoutUrl = checkoutUrl;

// 		return checkoutUrl;
// 	});
// });


// VNPayApi.get('/payment/callback', async (req, res) => {
//   const query = req.query;

// 	return vnpay.verifyReturnUrl(query).then(results => {
// 		if (results) {
// 			res.locals.email = 'tu.nguyen@naustud.io';
// 			res.locals.orderId = results.transactionId || '';
// 			res.locals.price = results.amount;
// 			res.locals.isSucceed = results.isSuccess;
// 			res.locals.message = results.message;
// 		} else {
// 			res.locals.isSucceed = false;
// 		}
// 	});
// });

// module.exports = VNPayApi