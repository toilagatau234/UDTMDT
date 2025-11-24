import axiosClient from './axiosClient';

const STATISTIC_URL_ENDPOINT = '/statistic';

const statisticApi = {
  // api: thống kê doanh thu theo tháng
  getStaMonthlyRevenue: (year = new Date().getFullYear()) => {
    const url = STATISTIC_URL_ENDPOINT + '/monthly-revenue';
    return axiosClient.get(url, { params: { year } });
  },
  getStaMonthlyRevenue2: (year = new Date().getFullYear()) => {
    const url = STATISTIC_URL_ENDPOINT + '/monthly-revenue2';
    return axiosClient.get(url, { params: { year } });
  },

  // api: thống kê doanh thu theo năm
  getStaAnnualRevenue: (
    startYear = new Date().getFullYear(),
    endYear = new Date().getFullYear(),
  ) => {
    const url = STATISTIC_URL_ENDPOINT + '/annual-revenue';
    return axiosClient.get(url, { params: { startYear, endYear } });
  },
  getStaAnnualRevenue2: (
    startYear = new Date().getFullYear(),
    endYear = new Date().getFullYear(),
  ) => {
    const url = STATISTIC_URL_ENDPOINT + '/annual-revenue2';
    return axiosClient.get(url, { params: { startYear, endYear } });
  },

  // api: thống kê đơn hàng tỉnh nào nhiều nhất
  getTopProvinceOrder: () => {
    const url = STATISTIC_URL_ENDPOINT + '/top-order';
    return axiosClient.get(url);
  },
  getTopProvinceOrder2: () => {
    const url = STATISTIC_URL_ENDPOINT + '/top-order2';
    return axiosClient.get(url);
  },

   // api: thống kê đơn hàng tỉnh nào nhiều nhất
   getTopProductOrder: () => {
    const url = STATISTIC_URL_ENDPOINT + '/top-product-order';
    return axiosClient.get(url);
  },
   getTopProductOrder2: () => {
    const url = STATISTIC_URL_ENDPOINT + '/top-product-order2';
    return axiosClient.get(url);
  },

   // api: thống kê danh thu từng sản phẩm
   getProductListRevenue: () => {
    const url = STATISTIC_URL_ENDPOINT + '/product-revenue';
    return axiosClient.get(url);
  },
   getProductListRevenue2: () => {
    const url = STATISTIC_URL_ENDPOINT + '/product-revenue2';
    return axiosClient.get(url);
  },
};


export default statisticApi;
