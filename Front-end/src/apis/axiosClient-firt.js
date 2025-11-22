import axios from 'axios';
import queryString from 'query-string';
import constants from 'constants/index';

//get env mode
const env = process.env.NODE_ENV;
const baseURL =
  !env || env === 'development'
    ? '/api'
    : process.env.REACT_APP_API_URL + '/apis';

//Set up default config for http request
// Tao ra 1 object dung chung cho moi noi can import no
const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'content-type': 'application/json',
  },
  withCredentials: true,
  //query string dung de parse url thanh json thay cho axios (tranh tuong hop null url)
  paramsSerializer: (params) => queryString.stringify(params),
});

//Tự động chèn Token vào Header trước khi gửi request
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const accessToken = localStorage.getItem(constants.ACCESS_TOKEN_KEY);
    if (accessToken) {
      // Thêm header Authorization: Bearer <token>
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//handle request
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    throw error;
  },
);

//handle response
axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    throw error;
  },
);

export default axiosClient;
