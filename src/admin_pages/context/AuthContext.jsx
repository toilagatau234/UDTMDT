import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiService from '../services/apiService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra token khi tải ứng dụng
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Kiểm tra xem token có hợp lệ và là admin
        if (decodedToken.exp * 1000 > Date.now() && decodedToken.role === 'admin') {
          setUser(JSON.parse(localStorage.getItem('adminUser')));
        } else {
          // Token hết hạn hoặc không phải admin
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập
  const login = async (username, password) => {
    try {
      const response = await apiService.post('/auth/login', { username, password });
      const { token, user } = response.data;

      // Kiểm tra user có phải là admin không
      if (user.role !== 'admin') {
        toast.error('Bạn không có quyền truy cập trang quản trị.');
        return;
      }

      // Lưu token và thông tin user
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      setUser(user);

      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    toast.success('Đăng xuất thành công!');
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;