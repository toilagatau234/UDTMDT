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

const mockOrders = []; 

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert('Vui lòng đăng nhập');
            navigate('/sign-in');
        } else {
            setOrders(mockOrders); 
        }
    }, [navigate]);

    const renderOrders = (orderList) => {
        if (orderList.length === 0) {
            return <p style={{ textAlign: 'center', marginTop: '50px' }}>
                Không có đơn hàng nào.
            </p>;
        }
        
        return orderList.map(order => (
            <WrapperOrderCard key={order._id}>
                <WrapperOrderHeader>
                    <span>Mã đơn: #{order._id.substring(0, 6)}</span>
                    <OrderStatus>{order.status}</OrderStatus>
                </WrapperOrderHeader>
                
                {order.products.map(product => (
                    <WrapperProductItem key={product._id}>
                        <img src={product.image} alt={product.name} />
                        <ProductInfo>
                            <ProductName>{product.name}</ProductName>
                            <ProductQuantity>Số lượng: {product.quantity}</ProductQuantity>
                        </ProductInfo>
                    </WrapperProductItem>
                ))}

                <WrapperOrderFooter>
                    <span>Tổng tiền:</span>
                    <TotalPrice>{order.totalPrice.toLocaleString('vi-VN')}đ</TotalPrice>
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
                    <h2>Đơn Mua</h2>
                    <WrapperTabs defaultActiveKey="1">
                        <WrapperTabs.TabPane tab="Tất cả" key="1">
                            {renderOrders(orders)}
                        </WrapperTabs.TabPane>
                        <WrapperTabs.TabPane tab="Hoàn thành" key="2">
                            {renderOrders(orders.filter(o => o.status === 'Hoàn thành'))}
                        </WrapperTabs.TabPane>
                        <WrapperTabs.TabPane tab="Đã hủy" key="3">
                            {renderOrders(orders.filter(o => o.status === 'Đã hủy'))}
                        </WrapperTabs.TabPane>
                    </WrapperTabs>
                </WrapperMainContent>
            </WrapperContent>
        </WrapperContainer>
    );
};

export default MyOrdersPage;