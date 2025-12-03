import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Dropdown, Badge, Popover, Button, Spin } from 'antd';
import {
  WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall,
  ButtonSearch, AccountDropdown, AccountDropdownItem,
} from './style';
import {
  CaretDownOutlined, ShoppingCartOutlined, UserOutlined, SearchOutlined,
  ProfileOutlined, OrderedListOutlined, HeartOutlined, EnvironmentOutlined, LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetCart } from '../../redux/slides/cartSlice'; 
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce';
// 👇 [MỚI] Thêm import hàm lấy ảnh
import { getImageUrl } from '../../services/ProductService';

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const cart = useSelector((state) => state.cart);
  const { items: cartItems, totalQuantity: totalCartQuantity } = cart;
  const debouncedSearchKey = useDebounce(searchKey, 500);

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

    const handleUserUpdated = (event) => {
      setUserData(event.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdated);
    return () => window.removeEventListener('userUpdated', handleUserUpdated);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchKey) {
        setLoadingSearch(true);
        setPopoverVisible(true);
        try {
          const res = await axios.get(
            `http://localhost:8080/api/products?search=${debouncedSearchKey}`
          );
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('cartItems'); 
    dispatch(resetCart());
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  const handleNavigateProfile = useCallback(() => navigate('/profile'), [navigate]);
  const handleNavigateLogin = useCallback(() => navigate('/sign-in'), [navigate]);
  const handleNavigateMyOrders = useCallback(() => navigate('/my-orders'), [navigate]);
  const handleNavigateWishlist = useCallback(() => navigate('/wishlist'), [navigate]);
  const handleNavigateAddresses = useCallback(() => navigate('/address'), [navigate]);
  const handleNavigateHome = useCallback(() => navigate('/'), [navigate]);
  const handleNavigateOrder = useCallback(() => navigate('/order'), [navigate]);

  const handleSearch = (value) => {
    setPopoverVisible(false);
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
    else navigate('/');
  };

  const handleSuggestionClick = (id) => {
    setPopoverVisible(false);
    setSearchKey('');
    // Đảm bảo đường dẫn có chữ 's' -> product-details
    navigate(`/product-details/${id}`);
  };

  const menu = (
    <AccountDropdown>
      <AccountDropdownItem onClick={handleNavigateProfile}>
        <ProfileOutlined />
        <span>Tài khoản của bạn</span>
      </AccountDropdownItem>
      <AccountDropdownItem onClick={handleNavigateMyOrders}>
        <OrderedListOutlined />
        <span>Quản lý đơn hàng</span>
      </AccountDropdownItem>
      <AccountDropdownItem onClick={handleNavigateWishlist}>
        <HeartOutlined />
        <span>Sản phẩm yêu thích</span>
      </AccountDropdownItem>
      <AccountDropdownItem onClick={handleNavigateAddresses}>
        <EnvironmentOutlined />
        <span>Địa chỉ giao hàng</span>
      </AccountDropdownItem>
      <AccountDropdownItem danger onClick={handleLogout}>
        <LogoutOutlined />
        <span>Đăng xuất</span>
      </AccountDropdownItem>
    </AccountDropdown>
  );

  const popoverContent = (
    <div style={{ width: '300px' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Sản Phẩm Mới Thêm</h4>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {cartItems.slice(0, 5).map((item) => (
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
                src={getImageUrl(item.image)} // Áp dụng getImageUrl cho giỏ hàng luôn cho chắc
                alt={item.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }}
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

  const searchSuggestionContent = (
    <div style={{ width: '568px' }}>
      {loadingSearch ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin />
        </div>
      ) : searchResults.length > 0 ? (
        searchResults.map((product) => {
            const price = product.variations?.[0]?.price || product.price;
            
            // 👇 [MỚI] Sửa logic lấy ảnh và bọc getImageUrl
            const rawImage = product.variations?.[0]?.image || product.images?.[0] || product.image;
            const imageUrl = getImageUrl(rawImage);

            // 👇 [MỚI] Lấy ID an toàn (tránh lỗi 404 khi click)
            const productId = product._id || product.id;

            return (
                <div
                    key={productId}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                    onClick={() => handleSuggestionClick(productId)}
                    className="suggestion-item"
                >
                    <img
                        src={imageUrl}
                        alt={product.name}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }}
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
                      {price ? price.toLocaleString('vi-VN') + 'đ' : ''}
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
              <Dropdown popupRender={() => menu} trigger={['hover']}>
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