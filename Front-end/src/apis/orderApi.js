import axiosClient from './axiosClient';

const ORDER_API_ENDPOINT = '/orders';

const orderApi = {
  // api: lấy danh sách đơn hàng
  getOrderList: (userId) => {
    const url = ORDER_API_ENDPOINT + '/list';
    return axiosClient.get(url, { params: { userId } });
  },

  // api: lấy chi tiết đơn hàng
  getOrderDetails: (orderId) => {
    const url = ORDER_API_ENDPOINT;
    return axiosClient.get(url, { params: { orderId } });
  },

  // api: tạo đơn hàng
  postCreateOrder: (data) => {
    const url = ORDER_API_ENDPOINT;
    return axiosClient.post(url, data);
  },
   getOrderList2: (userId) => {
    const url = ORDER_API_ENDPOINT + '/list2';
    return axiosClient.get(url, { params: { userId } });
  },
  getOrderList3: (userId) => {
    const url = ORDER_API_ENDPOINT + '/list3';
    return axiosClient.get(url, { params: { userId } });
  },

  // api: lấy chi tiết đơn hàng
  getOrderDetails2: (orderId) => {
    const url = ORDER_API_ENDPOINT + '/2';
    return axiosClient.get(url, { params: { orderId } });
  },
  getOrderDetails3: (orderId) => {
    const url = ORDER_API_ENDPOINT + '/3';
    return axiosClient.get(url, { params: { orderId } });
  },

  // api: tạo đơn hàng
  postCreateOrder2: (data) => {
    const url = ORDER_API_ENDPOINT + '/2';
    return axiosClient.post(url, data);
  },

   // api: xóa đơn hàng
   removeOrder: (id) => {
    const url = ORDER_API_ENDPOINT + '/';
    return axiosClient.delete(url, { params: { id } });
  },
};

export default orderApi;
