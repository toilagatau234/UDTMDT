import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query'; 

const Dangky = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [thongBao, setThongBao] = useState('');

  const queryClient = useQueryClient(); 

  const handleDangKy = async (e) => {
    e.preventDefault();

    if (!username || !email || !matKhau) {
      setThongBao('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', {
        tenNguoiDung: username,
        email: email,
        matKhau: matKhau,
      });

      setThongBao('Đăng ký thành công!');
      console.log(response.data);

      queryClient.invalidateQueries({ queryKey: ['authUser'] });

    } catch (error) {
      if (error.response) {
        console.error('Lỗi từ server:', error.response.data);
        setThongBao(error.response.data.message || 'Lỗi đăng ký. Vui lòng thử lại!');
      } else {
        console.error('Lỗi không xác định:', error.message);
        setThongBao('Lỗi không xác định. Vui lòng thử lại sau!');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Đăng ký<br />
        </h2>
        <form className="space-y-4" onSubmit={handleDangKy}>
          <input
            type="text"
            placeholder="Tên tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-pink-500 text-white font-semibold rounded hover:bg-pink-600 transition duration-200"
          >
            Đăng ký
          </button>
        </form>
        {thongBao && <p className="text-center text-red-500 mt-4">{thongBao}</p>}
        <Link
          className="block text-center text-pink-500 hover:underline mt-6"
          to="/dangnhap"
        >
          Bạn đã có tài khoản?
        </Link>
      </div>
    </div>
  );
};

export default Dangky;
