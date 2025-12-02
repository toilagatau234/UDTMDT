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
import ReviewModal from '../../components/ModalComponent/ReviewModal'; // [NEW] Import Modal

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- [NEW] STATE CHO MODAL ĐÁNH GIÁ ---
    const [isOpenReview, setIsOpenReview] = useState(false);
    const [reviewData, setReviewData] = useState({ 
        productInfo: null, 
        orderId: null 
    });

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

    // --- [FIX] HÀM MỞ MODAL ĐÁNH GIÁ ---
    const handleReview = (order) => {
        if (order.orderItems && order.orderItems.length > 0) {
            // Lấy sản phẩm đầu tiên để đánh giá (hoặc bạn có thể làm vòng lặp nút đánh giá cho từng sản phẩm)
            // Ở đây mình demo đánh giá sản phẩm đầu tiên trong đơn
            const product = order.orderItems[0]; 
            
            setReviewData({
                productInfo: {
                    id: product.product || product._id, // ID sản phẩm
                    name: product.name,
                    image: product.image,
                    variantName: product.variantName // Nếu có biến thể
                },
                orderId: order._id
            });
            setIsOpenReview(true);
        }
    };

    // --- Callback khi đánh giá xong ---
    const handleReviewSuccess = () => {
        fetchMyOrders(); // Tải lại danh sách đơn hàng (nếu backend có logic ẩn nút đánh giá sau khi đánh giá xong)
    };

    const getOrderStatusText = (order) => {
        if (order.status) {
            switch (order.status) {
                case 'Pending': return <span style={{ color: '#d35400', fontWeight: 'bold' }}>Đang chờ xử lý</span>;
                case 'Confirmed': return <span style={{ color: '#2980b9', fontWeight: 'bold' }}>Đã xác nhận</span>;
                case 'Shipped': return <span style={{ color: '#2980b9', fontWeight: 'bold' }}>Đang vận chuyển</span>;
                case 'Delivered': return <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Giao hàng thành công</span>;
                case 'Cancelled': return <span style={{ color: 'red', fontWeight: 'bold' }}>Đã hủy</span>;
                default: return <span style={{ color: '#333', fontWeight: 'bold' }}>{order.status}</span>;
            }
        }
        if (order.isDelivered) return <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Giao hàng thành công</span>;
        if (order.isPaid) return <span style={{ color: '#2980b9', fontWeight: 'bold' }}>Đã thanh toán</span>;
        return <span style={{ color: '#d35400', fontWeight: 'bold' }}>Chờ xác nhận</span>;
    };

    const handleBuyAgain = (order) => {
        if (order.orderItems && order.orderItems.length > 0) {
            const firstProductId = order.orderItems[0].product || order.orderItems[0]._id;
            navigate(`/product-details/${firstProductId}`);
        }
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
                            style={{ width: '70px', height: '70px', objectFit: 'cover', border: '1px solid #eee' }}
                        />
                        <ProductInfo>
                            <ProductName>{item.name}</ProductName>
                            {/* Hiển thị phân loại nếu có */}
                            {item.variantName && (
                                <div style={{ fontSize: '12px', color: '#888' }}>Phân loại: {item.variantName}</div>
                            )}
                            <ProductQuantity>x {item.amount || item.quantity}</ProductQuantity>
                            <div style={{ color: '#ff424e', marginTop: '4px' }}>
                                {item.price?.toLocaleString('vi-VN')}đ
                            </div>
                        </ProductInfo>
                        
                        {/* [NÂNG CAO] Nút đánh giá riêng cho từng sản phẩm (nếu muốn) */}
                        {/* {order.status === 'Delivered' && (
                             <Button size="small" onClick={() => {
                                 setReviewData({ productInfo: { ...item, id: item.product }, orderId: order._id });
                                 setIsOpenReview(true);
                             }}>Viết đánh giá</Button>
                        )} */}
                    </WrapperProductItem>
                ))}

                <WrapperOrderFooter>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                            <span>Tổng tiền: </span>
                            <TotalPrice>{order.totalPrice?.toLocaleString('vi-VN')}đ</TotalPrice>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Nút Đánh giá (Hiện tại đang đánh giá cho sp đầu tiên hoặc chung cho đơn) */}
                            {order.status === 'Delivered' && (
                                <Button onClick={() => handleReview(order)} style={{borderColor: '#326e51', color: '#326e51'}}>
                                    Đánh giá
                                </Button>
                            )}

                            {order.status === 'Pending' && (
                                <Popconfirm
                                    title="Hủy đơn hàng?"
                                    description="Bạn chắc chắn muốn hủy đơn này?"
                                    onConfirm={() => handleCancelOrder(order._id)}
                                    okText="Đồng ý"
                                    cancelText="Không"
                                >
                                    <Button danger type="primary">Hủy đơn hàng</Button>
                                </Popconfirm>
                            )}

                            {order.status === 'Cancelled' && (
                                <Button
                                    type="primary"
                                    ghost
                                    onClick={() => handleBuyAgain(order)}
                                    style={{ borderColor: '#00d165', color: '#00d165' }}
                                >
                                    Mua lại
                                </Button>
                            )}

                            {(order.status === 'Shipped' || order.status === 'Confirmed') && (
                                <Tag color="blue">Đang xử lý/Vận chuyển</Tag>
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

            {/* --- MODAL ĐÁNH GIÁ (NẰM Ở CUỐI TRANG) --- */}
            <ReviewModal 
                isOpen={isOpenReview}
                onCancel={() => setIsOpenReview(false)}
                onSuccess={handleReviewSuccess}
                productInfo={reviewData.productInfo}
                orderId={reviewData.orderId}
                token={localStorage.getItem('access_token')}
            />

        </WrapperContainer>
    );
};

export default MyOrdersPage;