const orderApi = require('express').Router();
const orderController = require('../controllers/order.controller');

// api: lấy danh sách đơn hàng
orderApi.get('/list', orderController.getOrderList);
orderApi.get('/list2', orderController.getOrderList2);
orderApi.get('/list3', orderController.getOrderList3);


// api: lấy chi tiết 1 đơn hàng
orderApi.get('/', orderController.getOrderDetails);
orderApi.get('/2', orderController.getOrderDetails2);
orderApi.get('/3', orderController.getOrderDetails3);

// api: tạo 1 đơn hàng (tách nhiều sản phẩm ra mỗi sp 1 đơn)
orderApi.post('/', orderController.postCreateOrder);
orderApi.post('/2', orderController.postCreateOrder2);

// api: Hủy đơn hàng
orderApi.delete('/', orderController.removeOrder)

module.exports = orderApi;
