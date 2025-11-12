import React from 'react'
import { Card, Rate } from 'antd' // <-- Bổ sung import Rate
import { useNavigate } from 'react-router-dom'
import {
    WrapperCardStyle,
    WrapperImageStyle,
    WrapperPriceText,
    WrapperDiscountText,
    WrapperReportText,
    WrapperStyleNameCard
} from './style'

const CardComponent = ({ 
    id,
    image = "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png", 
    name = "Tên sản phẩm", 
    price = 0, 
    rating = 0, // Giá trị rating được truyền từ HomePage (ví dụ: 5)
    sold = 0, 
    discount = 0 
}) => {
    const navigate = useNavigate();

    const handleNavigateDetail = () => {
        navigate(`/product-detail/${id}`);
    }

    return (
        <WrapperCardStyle
            hoverable
            cover={
                <WrapperImageStyle 
                    draggable={false}
                    alt={name}
                    src={image}
                />
            }
            onClick={handleNavigateDetail}
        >
            <WrapperStyleNameCard>{name}</WrapperStyleNameCard>
            
            <WrapperReportText>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    {/* === SỬ DỤNG RATE ĐỂ HIỂN THỊ SAO TRỰC QUAN === */}
                    <Rate 
                        allowHalf 
                        disabled 
                        value={rating} // Dùng giá trị rating (0-5)
                        style={{ fontSize: '12px', color: '#ffce3d' }} 
                    />
                    <span style={{ marginLeft: '4px' }}>
                        {/* (Tùy chọn) Hiển thị con số đánh giá bên cạnh */}
                        {rating}
                    </span>
                    {/* ============================================== */}
                </span>
                
                <span style={{ marginLeft: '10px' }}>
                    | Đã bán {sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold}+
                </span>
            </WrapperReportText>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <WrapperPriceText>
                    {price.toLocaleString('vi-VN')}đ
                </WrapperPriceText>
                {discount > 0 && (
                    <WrapperDiscountText>
                        -{discount}%
                    </WrapperDiscountText>
                )}
            </div>
        </WrapperCardStyle>
    )
}

export default CardComponent