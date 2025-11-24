import axiosClient from "./axiosClient";

const ADMIN_API_ENDPOINT = "/category";

const categoryApi = {
  // fn: thêm danh mục
  createCategory: (name) => {
    const url = ADMIN_API_ENDPOINT;
    return axiosClient.post(url, name);
  },

  // fn: lấy danh sách danh mục
  getCategories: () => {
    const url = ADMIN_API_ENDPOINT;
    return axiosClient.get(url);
  },

  // fn: cập nhập danh mục
  updateCategory: (category) => {
    const url = ADMIN_API_ENDPOINT + "/update";
    return axiosClient.put(url, category);
  },

  // fn: xóa danh mục
  deleteCategory: (id) => {
    const url = ADMIN_API_ENDPOINT + "/delete";
    return axiosClient.delete(url, { params: { id } });
  },
};

export default categoryApi;