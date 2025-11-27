import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  isLoading: false,
  error: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = false;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = false;
    },
    // THÊM ACTION CẦN THIẾU TẠI ĐÂY
    updateUser: (state, action) => {
      // Cập nhật thông tin người dùng bằng cách gộp các trường cũ và mới
      state.currentUser = { ...state.currentUser, ...action.payload }; 
      state.isLoading = false;
      state.error = false;
    }
  },
});

// EXPORT ACTION: Đảm bảo 'updateUser' được export
export const { loginSuccess, logout, updateUser } = userSlice.actions;

// EXPORT DEFAULT REDUCER:
export default userSlice.reducer;