import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/img/logo.png';
import { toast } from 'react-hot-toast';
import { 
  LoginBody,
  LoginWrapper,
  LoginBox,
  LoginLeft,
  LoginRight,
  LoginRightWrap
} from './style';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      // Gọi hàm login từ AuthContext
      await login(username, password);
      // AuthContext sẽ tự động xử lý chuyển hướng khi thành công
    } catch (error) {
      // Lỗi đã được xử lý bởi interceptor trong apiService
      console.error('Login failed in component:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginBody>
      <LoginWrapper>
        <LoginBox>
          <LoginLeft>
            <img src={logo} alt="Logo" />
          </LoginLeft>
          <LoginRight>
            <LoginRightWrap>
              <h1>Login For Admin</h1>
              <p className="account-subtitle">Access to our dashboard</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Login'}
                  </button>
                </div>
              </form>
            </LoginRightWrap>
          </LoginRight>
        </LoginBox>
      </LoginWrapper>
    </LoginBody>
  );
};

export default LoginPage;