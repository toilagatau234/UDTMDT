import axiosClient from './axiosClient';

const URL = '/coupons';

const couponApi = {
  getCoupons: () => {
    return axiosClient.get(URL);
  },
  createCoupon: (data) => {
    return axiosClient.post(URL, data);
  },
  checkCoupon: (code) => {
    return axiosClient.get(`${URL}/check`, { params: { code } });
  },
  deleteCoupon: (id) => {
    return axiosClient.delete(URL, { params: { id } });
  },
};

export default couponApi;