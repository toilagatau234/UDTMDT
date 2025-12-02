// File Service API của bạn (ĐÃ SỬA LỖI)
import axios from "axios";

// Đảm bảo URL này đúng với backend của bạn
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const axiosClient = axios.create({
    baseURL: API_URL,
});

// API lấy danh sách review (giữ nguyên)
export const getReviewsByProduct = async (productId, page = 1, limit = 5) => {
    const res = await axiosClient.get(`/review/get-reviews/${productId}?page=${page}&limit=${limit}`);
    return res.data;
};

// API tạo review (ĐÃ SỬA)
export const createReview = async (data, access_token) => {
    const res = await axiosClient.post(`/review/create`, data, {
        headers: {
            Authorization: `Bearer ${access_token}`, // ĐÃ SỬA: Thay 'token' bằng 'Authorization'
        }
    });
    return res.data;
};