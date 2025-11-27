import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    WrapperContainer, 
    WrapperContent, 
    WrapperSidebar, 
    WrapperMainContent 
} from '../ProfilePage/style'; 
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import {
    WrapperTabs,
    WrapperOrderCard,
    WrapperOrderHeader,
    OrderStatus,
    WrapperProductItem,
    ProductInfo,
    ProductName,
    ProductQuantity,
    WrapperOrderFooter,
    TotalPrice
} from './style';
import axios from 'axios';
import { message, Button, Popconfirm, Tag } from 'antd'; 

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const fetchMyOrders = async () => {
        setIsLoading(true);
        const userString = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (!userString || !token) {
            navigate('/sign-in');
            return;
        }

        const user = JSON.parse(userString);
        const userId = user.id || user._id;

        let cleanToken = token;
        if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
            cleanToken = cleanToken.slice(1, -1);
        }

        try {
            const res = await axios.get(`${API_URL}/api/order/get-all-order/${userId}`, {
                headers: {
                    token: `Bearer ${cleanToken}`,
                    Authorization: `Bearer ${cleanToken}`
                }
            });

            if (res.data.status === 'OK') {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, [navigate, API_URL]);

    const handleCancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('access_token');
            let cleanToken = token;
            if (cleanToken && cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
                cleanToken = cleanToken.slice(1, -1);
            }

            const res = await axios.delete(`${API_URL}/api/order/cancel-order/${orderId}`, {
                headers: {
                    token: `Bearer ${cleanToken}`,
                    Authorization: `Bearer ${cleanToken}`
                }
            });
            
            if (res.data.status === 'OK' || res.status === 200) {
                message.success('Đã hủy đơn hàng thành công!');
                fetchMyOrders(); 
            } else {
                message.error(res.data.message || 'Hủy thất bại');
            }
        } catch (e) {
            message.error('Lỗi khi hủy đơn hàng: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleReview = (order) => {
        if (order.orderItems && order.orderItems.length > 0) {
            const firstProductId = order.orderItems[0].product || order.orderItems[0]._id;
            navigate(`/product-detail/${firstProductId}`);
        }
    };

    const getOrderStatusText = (order) => {
        if (order.isDelivered) return <span style={{color: '#27ae60', fontWeight: 'bold'}}>Giao hàng thành công</span>;
        if (order.isPaid) return <span style={{color: '#2980b9', fontWeight: 'bold'}}>Đã thanh toán (Chờ giao hàng)</span>;
        return <span style={{color: '#d35400', fontWeight: 'bold'}}>Chờ xác nhận</span>;
    };

    const renderOrders = (orderList) => {
        if (isLoading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải...</p>;
        if (!orderList || orderList.length === 0) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Chưa có đơn hàng nào.</p>;
        
        return orderList.map(order => (
            <WrapperOrderCard key={order._id}>
                <WrapperOrderHeader>
                    <span>Mã đơn: #{order._id.substring(0, 8).toUpperCase()}</span>
                    <OrderStatus>{getOrderStatusText(order)}</OrderStatus>
                </WrapperOrderHeader>
                
                {order.orderItems?.map((item) => (
                    <WrapperProductItem key={item._id || item.product}>
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{width: '70px', height: '70px', objectFit: 'cover', border: '1px solid #eee'}}
                        />
                        <ProductInfo>
                            <ProductName>{item.name}</ProductName>
                            <ProductQuantity>x {item.amount || item.quantity}</ProductQuantity>
                            <div style={{color: '#ff424e', marginTop: '4px'}}>
                                {item.price?.toLocaleString('vi-VN')}đ
                            </div>
                        </ProductInfo>
                    </WrapperProductItem>
                ))}

                <WrapperOrderFooter>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                        <div>
                            <span>Tổng tiền: </span>
                            <TotalPrice>{order.totalPrice?.toLocaleString('vi-VN')}đ</TotalPrice>
                        </div>
                        
                        <div style={{display: 'flex', gap: '10px'}}>
                            
                            {/* --- 1. NÚT ĐÁNH GIÁ (HIỆN KHI ĐÃ GIAO HÀNG) --- */}
                            {order.isDelivered && (
                                <Button 
                                    style={{
                                        borderColor: '#ee4d2d', 
                                        color: '#fff', 
                                        background: '#ee4d2d',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => handleReview(order)}
                                >
                                    Đánh giá
                                </Button>
                            )}

                            {/* --- 2. NÚT HỦY ĐƠN (HIỆN KHI CHƯA GIAO & CHƯA THANH TOÁN) --- */}
                            {!order.isDelivered && !order.isPaid && (
                                <Popconfirm
                                    title="Hủy đơn hàng?"
                                    description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                    onConfirm={() => handleCancelOrder(order._id)}
                                    okText="Đồng ý"
                                    cancelText="Không"
                                >
                                    <Button danger type="primary">Hủy đơn hàng</Button>
                                </Popconfirm>
                            )}

                            {/* --- 3. TRẠNG THÁI VNPAY (ĐÃ THANH TOÁN - CHƯA GIAO) --- */}
                            {!order.isDelivered && order.isPaid && (
                                <Tag color="blue" style={{fontSize: '14px', padding: '5px 10px'}}>
                                    Đang vận chuyển
                                </Tag>
                            )}
                            
                        </div>
                    </div>
                </WrapperOrderFooter>
            </WrapperOrderCard>
        ));
    };

    return (
        <WrapperContainer>
            <WrapperContent>
                <WrapperSidebar>
                    <ProfileSidebar />
                </WrapperSidebar>

                <WrapperMainContent>
                    <h2>Đơn Mua của tôi</h2>
                    <WrapperTabs defaultActiveKey="1">
                        <WrapperTabs.TabPane tab="Tất cả" key="1">
                            {renderOrders(orders)}
                        </WrapperTabs.TabPane>
                        <WrapperTabs.TabPane tab="Đang xử lý" key="2">
                            {renderOrders(orders.filter(o => !o.isDelivered && !o.isPaid))}
                        </WrapperTabs.TabPane>
                        <WrapperTabs.TabPane tab="Hoàn thành" key="3">
                            {renderOrders(orders.filter(o => o.isDelivered || o.isPaid))}
                        </WrapperTabs.TabPane>
                    </WrapperTabs>
                </WrapperMainContent>
            </WrapperContent>
        </WrapperContainer>
    );
};

export default MyOrdersPage;