// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slides/cartSlice'

// ĐÃ SỬA: Thay userSlice thành userSlide để khớp với tên file thực tế
import userReducer from './slides/userSlice' 

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer, // Key 'user' vẫn giữ nguyên
  },
})