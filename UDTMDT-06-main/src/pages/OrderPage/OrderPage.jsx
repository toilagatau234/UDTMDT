import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { Button, InputNumber, Checkbox, Modal, message } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { 
    updateQuantity, 
    removeFromCart, 
    toggleSelectItem, 
    toggleSelectAll 
} from '../../redux/slides/cartSlice';
import axiosClient from '../../apis/axiosClient';

import {
    WrapperContainer, WrapperBody, WrapperLeftCol, WrapperRightCol,
    WrapperCartHeader, WrapperCartItem, ItemCheckbox, WrapperItemInfo,
    ItemName, ItemPrice, OriginalPrice, ItemQuantity, ItemTotalPrice, ItemAction,
    WrapperSummary, SummaryRow, WrapperTotal, TotalPriceText, CheckoutButton
} from './style';

const OrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Khai báo location
    const cart = useSelector(state => state.cart);
    
    // Lấy user từ Redux (hoặc localStorage nếu Redux chưa kịp load)
    const userRedux = useSelector(state => state.user);
    const [user, setUser] = useState(userRedux);

    const [deliveryAddress, setDeliveryAddress] = useState('');

    // --- 1. LẤY USER TỪ LOCALSTORAGE ĐỂ CHẮC CHẮN CÓ DỮ LIỆU ---
    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (userStorage) {
            setUser(JSON.parse(userStorage));
        }
    }, []);

    // --- 2. LOGIC HIỂN THỊ ĐỊA CHỈ (FIX LỖI OBJECT) ---
    useEffect(() => {
        if (user) {
            let address = '';
            
            // Ưu tiên 1: Lấy từ mảng addresses (Schema mới)
            if (user.addresses && user.addresses.length > 0) {
                const defaultAddr = user.addresses.find(addr => addr.isDefault) || user.addresses[0]; 
                if (defaultAddr) {
                    const parts = [
                        defaultAddr.specificAddress, 
                        defaultAddr.ward, 
                        defaultAddr.district, 
                        defaultAddr.province
                    ].filter(part => part); 
                    
                    address = parts.join(', ');
                }
            } 
            // Ưu tiên 2: Lấy từ trường address cũ
            else if (user.address) {
                if (typeof user.address === 'object') {
                    address = Object.values(user.address).join(', ');
                } else {
                    address = String(user.address);
                }
            }

            if (address === '[object Object]') address = '';

            const userName = user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : '') || '';
            const userPhone = user.phone ? `(${user.phone})` : '';
            
            if(address && userName) {
                setDeliveryAddress(`${userName} ${userPhone} - ${address}`);
            } else if (address) {
                setDeliveryAddress(address);
            } else {
                setDeliveryAddress('');
            }
        }
    }, [user]);

    const syncCartToDB = () => {
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;
                const currentCart = JSON.parse(localStorage.getItem('cartItems') || '{"items": []}');
                const itemsToSave = currentCart.items.map(i => ({ ...i, amount: i.quantity }));
                await axiosClient.put('/api/users/update-cart', { cartItems: itemsToSave });
            } catch (e) { console.error("Lỗi sync cart:", e); }
        }, 300);
    };

    const handleRemoveItem = (productId) => {
        if(!productId) return;
        dispatch(removeFromCart(productId));
        syncCartToDB(); 
        message.success('Đã xóa sản phẩm');
    };

    const handleQuantityChange = (product, value) => {
        dispatch(updateQuantity({ product: product, quantity: value }));
        syncCartToDB();
    };

    const handleToggleItem = (productId) => {
        dispatch(toggleSelectItem(productId));
    };

    const handleToggleSelectAll = (e) => {
        dispatch(toggleSelectAll(e.target.checked));
    };

    const handleRemoveAllSelected = () => {
        const selectedIds = cart.items.filter(item => item.selected).map(item => item.product);
        if(selectedIds.length === 0) {
            message.warning('Vui lòng chọn sản phẩm cần xóa');
            return;
        }
        if(window.confirm(`Bạn chắc chắn muốn xóa ${selectedIds.length} sản phẩm này?`)) {
             selectedIds.forEach(id => dispatch(removeFromCart(id)));
             syncCartToDB();
             message.success('Đã xóa các sản phẩm đã chọn');
        }
    }

    const { selectedItems, subtotal, totalItems, areAllSelected } = useMemo(() => {
        const selectedItems = cart.items.filter(item => item.selected);
        const subtotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalItems = selectedItems.length;
        const areAllSelected = cart.items.length > 0 && cart.items.every(item => item.selected);
        return { selectedItems, subtotal, totalItems, areAllSelected };
    }, [cart.items]);

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            message.warning('Vui lòng chọn ít nhất một sản phẩm để mua hàng.');
        } else {
            navigate('/payment', { state: { items: selectedItems, subtotal, total } });
        }
    };

    return (
        <WrapperContainer>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                 <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Giỏ hàng</h2>
            </div>
            
            <WrapperBody>
                <WrapperLeftCol span={17}>
                    <WrapperCartHeader>
                        <Checkbox style={{ width: '5%' }} onChange={handleToggleSelectAll} checked={areAllSelected} />
                        <span style={{ width: '40%' }}>
                            Sản phẩm 
                            {selectedItems.length > 0 && (
                                <span style={{fontSize: '12px', color: '#ff4d4f', cursor: 'pointer', marginLeft: '10px'}} onClick={handleRemoveAllSelected}>
                                    (Xóa {selectedItems.length} đã chọn)
                                </span>
                            )}
                        </span>
                        <span style={{ width: '25%' }}>Đơn giá</span>
                        <span style={{ width: '15%' }}>Số lượng</span>
                        <span style={{ width: '10%', textAlign: 'center' }}>Số tiền</span>
                        <span style={{ width: '5%', textAlign: 'right' }}>Xóa</span>
                    </WrapperCartHeader>

                    {cart.items.length === 0 ? (
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <p>Giỏ hàng của bạn đang trống.</p>
                            <Button type="primary" onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>
                        </div>
                    ) : (
                        cart.items.map(item => (
                            <WrapperCartItem key={item.product}>
                                <ItemCheckbox checked={item.selected} onChange={() => handleToggleItem(item.product)} />
                                <WrapperItemInfo>
                                    <img src={item.image} alt={item.name} />
                                    <ItemName onClick={() => navigate(`/product-detail/${item.product}`)} style={{cursor: 'pointer'}}>{item.name}</ItemName>
                                </WrapperItemInfo>
                                <ItemPrice>
                                    {item.originalPrice > item.price && <OriginalPrice>{item.originalPrice.toLocaleString('vi-VN')}đ</OriginalPrice>}
                                    <span style={{ fontWeight: 500, color: '#326e51' }}>{item.price.toLocaleString('vi-VN')}đ</span>
                                </ItemPrice>
                                <ItemQuantity>
                                    <div style={{display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px'}}>
                                        <Button icon={<MinusOutlined />} type="text" size="small" onClick={() => { if (item.quantity > 1) handleQuantityChange(item.product, item.quantity - 1) }} />
                                        <InputNumber min={1} max={item.stockQuantity} value={item.quantity} onChange={(value) => handleQuantityChange(item.product, value)} controls={false} style={{width: '40px', textAlign: 'center', border: 'none'}} />
                                        <Button icon={<PlusOutlined />} type="text" size="small" onClick={() => { if (item.quantity < item.stockQuantity) handleQuantityChange(item.product, item.quantity + 1) }} />
                                    </div>
                                </ItemQuantity>
                                <ItemTotalPrice>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</ItemTotalPrice>
                                <ItemAction>
                                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveItem(item.product)} />
                                </ItemAction>
                            </WrapperCartItem>
                        ))
                    )}
                </WrapperLeftCol>

                <WrapperRightCol span={7}>
                    <WrapperSummary>
                        <div style={{ paddingBottom: '15px', marginBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                <span style={{fontWeight: '600', display:'flex', alignItems:'center', gap:'5px'}}>
                                    <EnvironmentOutlined style={{color: '#326e51'}}/> Giao tới:
                                </span>
                                {/* 👇 CHÍNH LÀ CHỖ NÀY ĐÃ ĐƯỢC SỬA 👇 */}
                                <span 
                                    style={{ fontWeight: 500, color: '#3d6ef7', cursor: 'pointer', fontSize: '13px' }} 
                                    onClick={() => navigate('/address', { state: { from: '/order' } })}
                                >
                                    Thay đổi
                                </span>
                                {/* 👆 ----------------------------- 👆 */}
                            </div>
                            
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#333', lineHeight: '1.4' }}>
                                {deliveryAddress ? (
                                    deliveryAddress
                                ) : (
                                    <span style={{color: '#ff4d4f', fontStyle: 'italic'}}>Bạn chưa có địa chỉ giao hàng</span>
                                )}
                            </div>
                        </div>

                        <SummaryRow>
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                        </SummaryRow>
                        <SummaryRow>
                            <span>Phí giao hàng</span>
                            <span>{shippingFee === 0 ? 'Miễn phí' : shippingFee.toLocaleString('vi-VN') + 'đ'}</span>
                        </SummaryRow>
                        <WrapperTotal>
                            <span>Tổng cộng</span>
                            <TotalPriceText>{total.toLocaleString('vi-VN')}đ</TotalPriceText>
                        </WrapperTotal>
                        <CheckoutButton onClick={handleCheckout}>
                            Thanh Toán ({totalItems})
                        </CheckoutButton>
                    </WrapperSummary>
                </WrapperRightCol>
            </WrapperBody>
        </WrapperContainer>
    );
};

export default OrderPage;