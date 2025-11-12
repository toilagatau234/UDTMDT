import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Dropdown, Menu, Badge, Popover, Button, Spin } from 'antd';
import {
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
  ButtonSearch,
} from './style';
import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce'; 

const HeaderComponent = () => {
  const navigate = useNavigate();
  // const location = useLocation(); // Không sử dụng nên có thể bỏ

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // State tìm kiếm
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  // Lấy giỏ hàng từ Redux
  const cart = useSelector((state) => state.cart);
  const { items: cartItems, totalQuantity: totalCartQuantity } = cart;

  // Debounce để tránh gọi API quá nhiều lần
  const debouncedSearchKey = useDebounce(searchKey, 500);

  // Kiểm tra user login
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user) {
          setUserData(user);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error('Lỗi parse user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // API gợi ý tìm kiếm (luôn hoạt động)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchKey) {
        setLoadingSearch(true);
        // Luôn hiển thị popover khi có từ khóa
        setPopoverVisible(true); 
        try {
          const res = await axios.get(
            `http://localhost:8080/api/products?search=${debouncedSearchKey}`
          );
          // Đảm bảo truy cập an toàn res.data.data
          setSearchResults(res.data?.data?.slice(0, 6) || []);
        } catch (e) {
          console.error(e);
          setSearchResults([]);
        }
        setLoadingSearch(false);
      } else {
        setSearchResults([]);
        setPopoverVisible(false);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchKey]); 

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    // Dùng navigate và reload để đảm bảo Redux state và Auth context được refresh
    navigate('/');
    window.location.reload(); 
  };

  // Điều hướng
  const handleNavigateProfile = useCallback(() => navigate('/profile'), [navigate]);
  const handleNavigateLogin = useCallback(() => navigate('/sign-in'), [navigate]);
  const handleNavigateMyOrders = useCallback(() => navigate('/my-orders'), [navigate]);
  const handleNavigateHome = useCallback(() => navigate('/'), [navigate]);
  const handleNavigateOrder = useCallback(() => navigate('/order'), [navigate]);

  // Khi nhấn Enter hoặc icon tìm kiếm
  const handleSearch = (value) => {
    // setSearchKey(value); // Không cần set lại vì onChange đã làm rồi
    setPopoverVisible(false); // Tắt gợi ý
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
    else navigate('/');
  };

  // Khi click vào gợi ý
  const handleSuggestionClick = (id) => {
    setPopoverVisible(false);
    setSearchKey(''); // Xóa từ khóa tìm kiếm
    navigate(`/product-detail/${id}`);
  };

  // Menu dropdown tài khoản
  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleNavigateProfile}>
        Tài Khoản Của Tôi
      </Menu.Item>
      <Menu.Item key="orders" onClick={handleNavigateMyOrders}>
        Đơn Mua
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} danger>
        Đăng Xuất
      </Menu.Item>
    </Menu>
  );

  // Popover giỏ hàng mini (Giữ nguyên, chỉ cần đảm bảo item.price được định dạng)
  const popoverContent = (
    <div style={{ width: '300px' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Sản Phẩm Mới Thêm</h4>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {cartItems.slice(0, 5).map((item) => ( // Giới hạn 5 sản phẩm
            <div
              key={item.product}
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    maxWidth: '150px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.name}
                </div>
                <div style={{ color: '#326e51', fontWeight: '500' }}>
                  {item.price ? item.price.toLocaleString('vi-VN') + 'đ' : 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        style={{
          width: '100%',
          marginTop: '10px',
          backgroundColor: '#326e51',
          borderColor: '#326e51',
        }}
        type="primary"
        onClick={handleNavigateOrder}
      >
        Xem Giỏ Hàng
      </Button>
    </div>
  );

  // Popover gợi ý tìm kiếm (Tối ưu hóa hiển thị giá)
  const searchSuggestionContent = (
    <div style={{ width: '568px' }}>
      {loadingSearch ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin />
        </div>
      ) : searchResults.length > 0 ? (
        searchResults.map((product) => {
            const price = product.variations?.[0]?.price;
            const imageUrl = product.variations?.[0]?.image || product.images?.[0]?.url;

            return (
                <div
                    key={product._id}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                    onClick={() => handleSuggestionClick(product._id)}
                    className="suggestion-item"
                >
                    <img
                        src={imageUrl} // Sử dụng imageUrl đã xử lý
                        alt={product.name}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    />
                    <span
                        style={{
                          fontSize: '14px',
                          flex: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                    >
                      {product.name}
                    </span>
                    <span
                        style={{
                          fontSize: '14px',
                          color: '#326e51',
                          fontWeight: 500,
                        }}
                    >
                      {price ? price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                    </span>
                </div>
            );
        })
      ) : (
        <div style={{ padding: '12px' }}>Không tìm thấy sản phẩm.</div>
      )}
    </div>
  );

  return (
    <div>
      <WrapperHeader>
        <Row
          style={{
            width: '1270px',
            margin: '0 auto',
            alignItems: 'center',
          }}
        >
          <Col span={6}>
            <WrapperTextHeader
              onClick={handleNavigateHome}
              style={{ color: '#fff' }}
            >
              BEAUTYCOSMETIC
            </WrapperTextHeader>
          </Col>

          <Col span={12}>
            <Popover
              content={searchSuggestionContent}
              open={popoverVisible}
              trigger="click"
              placement="bottom"
              // Tinh chỉnh onOpenChange để Popover tự tắt khi click ra ngoài mà không có từ khóa
              onOpenChange={(visible) => {
                 setPopoverVisible(visible && !!searchKey);
              }}
            >
              <ButtonSearch
                placeholder="Nhập thứ bạn cần tìm"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </Popover>
          </Col>

          <Col
            span={6}
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {isLoggedIn ? (
              <Dropdown overlay={menu} trigger={['hover']}>
                <WrapperHeaderAccount style={{ cursor: 'pointer' }}>
                  <UserOutlined style={{ fontSize: '30px', color: '#fff' }} />
                  <WrapperTextHeaderSmall
                    style={{ fontSize: '14px', color: '#fff', marginLeft: '5px' }}
                  >
                    {userData?.firstName || 'Tài khoản'}
                  </WrapperTextHeaderSmall>
                </WrapperHeaderAccount>
              </Dropdown>
            ) : (
              <WrapperHeaderAccount
                onClick={handleNavigateLogin}
                style={{ cursor: 'pointer' }}
              >
                <UserOutlined style={{ fontSize: '30px', color: '#fff' }} />
                <div>
                  <WrapperTextHeaderSmall style={{ color: '#fff' }}>
                    Đăng nhập/Đăng ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall style={{ color: '#fff' }}>
                      Tài khoản
                    </WrapperTextHeaderSmall>
                    <CaretDownOutlined style={{ color: '#fff' }} />
                  </div>
                </div>
              </WrapperHeaderAccount>
            )}

            <Popover
              content={popoverContent}
              trigger="hover"
              placement="bottomRight"
              zIndex={999}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                }}
                onClick={handleNavigateOrder}
              >
                <Badge count={totalCartQuantity} size="small">
                  <ShoppingCartOutlined
                    style={{ fontSize: '30px', color: '#fff' }}
                  />
                </Badge>
                <WrapperTextHeaderSmall style={{ color: '#fff' }}>
                  Giỏ Hàng
                </WrapperTextHeaderSmall>
              </div>
            </Popover>
          </Col>
        </Row>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;