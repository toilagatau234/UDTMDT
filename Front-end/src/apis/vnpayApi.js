import axiosClient from './axiosClient';

const VNPAY_API_ENDPOINT = '/vnpay';

const vnpayApi = {
  // data: { amount, orderId, bankCode, language }
  // createPaymentUrl: (data) => {
  //   const url = VNPAY_API_ENDPOINT + '/create_payment_url';
  //   return axiosClient.post(url, data);
  // },
  vnpayCheckout: (params) => {
    const url = VNPAY_API_URL + '/payment/checkout';
    return axiosClient.post(url);
  }
};

export default vnpayApi;