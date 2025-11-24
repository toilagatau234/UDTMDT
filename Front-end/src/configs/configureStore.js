import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/index';

// Cấu hình store sử dụng Redux Toolkit
const configStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Tắt kiểm tra serializable nếu cần thiết (cho promise, function...)
      }),
    devTools: process.env.NODE_ENV !== 'production', // Tự động bật DevTools ở môi trường dev
  });
  
  return store;
};

export default configStore;