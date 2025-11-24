import axiosClient from './axiosClient';

const COMMENT_API_URL = '/comments';

const commentApi = {
  // api: Lấy danh sách comment của 1 sản phẩm
  getCommentList: (id) => {
    const url = COMMENT_API_URL;
    return axiosClient.get(url, { params: { id } });
  },

  // api: Thêm 1 comment
  postComment: (cmt) => {
    const url = COMMENT_API_URL;
    return axiosClient.post(url, cmt);
  },

   // api: Chỉnh sửa 1 comment
   updateComment: (_id, content) => {
    const url = COMMENT_API_URL;
    return axiosClient.put(url,  {_id, content});
  },

  // api: Xóa 1 comment
  deleteComment: (id) => {
    const url = COMMENT_API_URL;
    return axiosClient.delete(url, { params: { id } });
  },
};

export default commentApi;
