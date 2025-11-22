const statisticApi = require('express').Router();
const statisticController = require('../controllers/statistic.controller');

// api: thống kê doanh thu theo tháng
statisticApi.get('/monthly-revenue', statisticController.getStaMonthlyRevenue);
statisticApi.get('/monthly-revenue2', statisticController.getStaMonthlyRevenue2);

// api: thống kê doanh thu theo năm
statisticApi.get('/annual-revenue', statisticController.getStaAnnualRevenue);
statisticApi.get('/annual-revenue2', statisticController.getStaAnnualRevenue2);

// api: thống kê đơn hàng tỉnh nào nhiều nhất
statisticApi.get('/top-order', statisticController.getTopProvinceOrder);
statisticApi.get('/top-order2', statisticController.getTopProvinceOrder2);

// api: thống kê sản phẩm có nhiều đơn đặt hàng
statisticApi.get('/top-product-order', statisticController.getTopProductOrder);
statisticApi.get('/top-product-order2', statisticController.getTopProductOrder2);

// api: thống kê danh thu từng sản phẩm
statisticApi.get('/product-revenue', statisticController.getProductListRevenue);
statisticApi.get('/product-revenue2', statisticController.getProductListRevenue2);

module.exports = statisticApi;
