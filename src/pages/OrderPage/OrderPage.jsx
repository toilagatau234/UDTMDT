import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, InputNumber, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { updateQuantity, removeFromCart, toggleSelectItem, toggleSelectAll } from '../../redux/cartSlice';
import {
    WrapperContainer, WrapperBody, WrapperLeftCol, WrapperRightCol,
    WrapperCartHeader, WrapperCartItem, ItemCheckbox, WrapperItemInfo,
    ItemName, ItemPrice, OriginalPrice, ItemQuantity, ItemTotalPrice, ItemAction,
    WrapperSummary, SummaryRow, WrapperTotal, TotalPriceText, CheckoutButton
} from './style';

const OrderPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);

    const handleQuantityChange = (product, value) => {
        dispatch(updateQuantity({ product: product, quantity: value }));
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleToggleItem = (productId) => {
        dispatch(toggleSelectItem(productId));
    };

    const handleToggleSelectAll = (e) => {
        dispatch(toggleSelectAll(e.target.checked));
    };

    const { selectedItems, subtotal, totalItems, areAllSelected } = useMemo(() => {
        const selectedItems = cart.items.filter(item => item.selected);
        const subtotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalItems = selectedItems.length;
        const areAllSelected = cart.items.length > 0 && cart.items.every(item => item.selected);
        return { selectedItems, subtotal, totalItems, areAllSelected };
    }, [cart.items]);

    // Tạm tính phí ship (Bạn có thể thay đổi logic này)
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để mua hàng.');
        } else {
            navigate('/payment', { 
                state: {
                    items: selectedItems,
                    subtotal: subtotal,
                    total: total
                } 
            });
        }
    };

    return (
        <WrapperContainer>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                 <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Giỏ hàng</h2>
            </div>
            
            <WrapperBody>
                <WrapperLeftCol span={17}>
                    {/* ĐÂY LÀ PHẦN TIÊU ĐỀ (HEADER) VỚI WIDTH */}
                    <WrapperCartHeader>
                        <Checkbox 
                            style={{ width: '5%' }} 
                            onChange={handleToggleSelectAll}
                            checked={areAllSelected}
                        />
                        <span style={{ width: '40%' }}>Sản phẩm</span>
                        <span style={{ width: '25%' }}>Đơn giá</span>
                        <span style={{ width: '15%' }}>Số lượng</span>
                        <span style={{ width: '10%', textAlign: 'center' }}>Số tiền</span>
                        <span style={{ width: '5%', textAlign: 'right' }}>Xóa</span>
                    </WrapperCartHeader>

                    {cart.items.length === 0 ? (
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <p>Giỏ hàng của bạn đang trống.</p>
                        </div>
                    ) : (
                        cart.items.map(item => (
                            <WrapperCartItem key={item.product}>
                                <ItemCheckbox 
                                    checked={item.selected} 
                                    onChange={() => handleToggleItem(item.product)}
                                />
                                <WrapperItemInfo>
                                    <img src={item.image} alt={item.name} />
                                    <ItemName>{item.name}</ItemName>
                                </WrapperItemInfo>
                                <ItemPrice>
                                    {item.originalPrice > item.price && (
                                        <OriginalPrice>
                                            {item.originalPrice.toLocaleString('vi-VN')}đ
                                        </OriginalPrice>
                                    )}
                                    <span style={{ fontWeight: 500, color: '#326e51' }}>
                                        {item.price.toLocaleString('vi-VN')}đ
                                    </span>
                                </ItemPrice>
                                <ItemQuantity>
                                    <InputNumber
                                        min={1}
                                        max={item.stockQuantity}
                                        value={item.quantity}
                                        onChange={(value) => handleQuantityChange(item.product, value)}
                                    />
                                </ItemQuantity>
                                <ItemTotalPrice>
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                </ItemTotalPrice>
                                <ItemAction>
                                    <Button 
                                        type="text" 
                                        danger 
                                        icon={<DeleteOutlined />} 
                                        onClick={() => handleRemoveItem(item.product)} 
                                    />
                                </ItemAction>
                            </WrapperCartItem>
                        ))
                    )}
                </WrapperLeftCol>

                <WrapperRightCol span={7}>
                    <WrapperSummary>
                        <SummaryRow>
                            <span>Địa chỉ</span>
                            <span style={{ fontWeight: 500, color: '#326e51', cursor: 'pointer' }}>Thay đổi</span>
                        </SummaryRow>
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