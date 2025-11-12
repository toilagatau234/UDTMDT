import React, { useState, useEffect } from 'react';
// SỬA LỖI: THÊM 'Image' TRỞ LẠI VÀO DÒNG NÀY
import { Row, Col, Button, message, Popover, Image } from 'antd';
import { 
    PlusOutlined, MinusOutlined, SafetyOutlined,
    CheckCircleOutlined, CarOutlined, DownOutlined,
    ShoppingCartOutlined, SolutionOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';

import {
    WrapperContainer, WrapperLayout,
    WrapperStyleImageSmall, WrapperThumbnailGroup, WrapperStyleColImage,
    WrapperStyleColInfo, WrapperStyleNameProduct,
    WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct,
    WrapperOriginalPrice, WrapperDiscount,
    WrapperQualityProduct, WrapperBtnQualityProduct, WrapperInputNumber, 
    WrapperStockText, WrapperQualityLabel,
    WrapperDescription, WrapperInfoRow, WrapperInfoLabel, WrapperInfoContent,
    WrapperVariationGroup, WrapperVariationButton,
    WrapperShipping, WrapperGuarantee,
    WrapperButtonRow, AddToCartButton, BuyNowButton
} from './style';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    const [selectedVariation, setSelectedVariation] = useState(null);
    
    const dispatch = useDispatch();

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day} Th${month}`;
    };
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 3);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 5);
    const startDateString = formatDate(startDate);
    const endDateString = formatDate(endDate);

    const fetchProductDetails = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
            if (response.data && response.data.data) {
                const productData = response.data.data;
                setProduct(productData);
                
                if (productData.variations && productData.variations.length > 0) {
                    const firstVariation = productData.variations[0];
                    setSelectedVariation(firstVariation);
                    setMainImage(firstVariation.image);
                } else if (productData.images && productData.images.length > 0) {
                    setMainImage(productData.images[0].url);
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            message.error('Không tìm thấy sản phẩm');
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductDetails(id);
        }
    }, [id]);

    const handleVariationClick = (variation) => {
        setSelectedVariation(variation);
        setMainImage(variation.image);
        setQuantity(1);
    };

    const maxStock = selectedVariation ? selectedVariation.stockQuantity : 0;

    const handleQuantityChange = (value) => {
        if (!selectedVariation) return;
        if (value >= 1 && value <= maxStock) {
            setQuantity(value);
        }
    };
    const increaseQuantity = () => {
        if (!selectedVariation) return;
        if (quantity < maxStock) {
            setQuantity(quantity + 1);
        }
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (!product || !selectedVariation) return;

        dispatch(addToCart({
            product: product._id,
            variationSku: selectedVariation.sku,
            name: `${product.name} (${selectedVariation.name})`,
            image: selectedVariation.image,
            price: selectedVariation.price,
            originalPrice: selectedVariation.originalPrice,
            stockQuantity: selectedVariation.stockQuantity,
            quantity: quantity,
        }));
    };

    const handleBuyNow = () => {
        if (!product || !selectedVariation) return;

        const item = {
            product: product._id,
            variationSku: selectedVariation.sku,
            name: `${product.name} (${selectedVariation.name})`,
            image: selectedVariation.image,
            price: selectedVariation.price,
            originalPrice: selectedVariation.originalPrice,
            stockQuantity: selectedVariation.stockQuantity,
            quantity: quantity,
        };

        const subtotal = item.price * item.quantity;
        const shippingFee = subtotal >= 500000 ? 0 : 30000;
        const total = subtotal + shippingFee;

        navigate('/payment', {
            state: {
                items: [item],
                subtotal: subtotal,
                total: total
            }
        });
    };

    if (!product || !selectedVariation) {
        return <div>Đang tải...</div>;
    }

    const price = selectedVariation.price;
    const originalPrice = selectedVariation.originalPrice;
    const discount = (originalPrice && price < originalPrice) 
        ? Math.round(((originalPrice - price) / originalPrice) * 100) 
        : 0;

    const guaranteeContent = (
      <div style={{ maxWidth: '300px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>An tâm mua sắm</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <SafetyOutlined style={{ fontSize: '20px', color: '#d0011b', paddingTop: '3px' }} />
          <div>
            <strong>Trả hàng miễn phí 15 ngày</strong>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>Miễn phí trả hàng trong 15 ngày nếu không vừa ý.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <CheckCircleOutlined style={{ fontSize: '20px', color: '#326e51', paddingTop: '3px' }} />
          <div>
            <strong>Chính hãng 100%</strong>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>Đền bù 111% nếu phát hiện hàng giả.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <CarOutlined style={{ fontSize: '20px', paddingTop: '3px' }} />
          <div>
            <strong>Miễn phí vận chuyển</strong>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>Ưu đãi vận chuyển cho đơn hàng từ 150.000đ.</p>
          </div>
        </div>
      </div>
    );

    return (
        <WrapperContainer>
            <WrapperLayout>
                <Row>
                    {/* CỘT BÊN TRÁI (ẢNH) */}
                    <WrapperStyleColImage span={10}>
                        {/* Ảnh chính này vẫn dùng <Image> của AntD để có preview */}
                        <Image 
                            src={mainImage} 
                            alt={product.name} 
                            style={{ 
                                width: '100%', 
                                height: '450px', 
                                objectFit: 'contain', 
                                border: '1px solid #f0f0f0', 
                                borderRadius: '8px' 
                            }} 
                        />
                        
                        {/* SỬA LẠI THUMBNAILS ĐỂ LẤY TỪ 'variations'
                          (Code cũ của bạn đang lặp qua 'product.images')
                        */}
                        <WrapperThumbnailGroup>
                            {product.variations.map((variation, index) => {
                                return (
                                    <WrapperStyleImageSmall
                                        key={variation.sku}
                                        src={variation.image}
                                        alt={variation.name}
                                        onClick={() => {
                                            if (variation.stockQuantity > 0) {
                                                handleVariationClick(variation)
                                            }
                                        }}
                                        className={selectedVariation.sku === variation.sku ? 'active' : ''}
                                        disabled={variation.stockQuantity === 0}
                                    />
                                )
                            })}
                        </WrapperThumbnailGroup>
                        
                    </WrapperStyleColImage>

                    {/* CỘT BÊN PHẢI (THÔNG TIN) */}
                    <WrapperStyleColInfo span={14}>
                        <WrapperStyleNameProduct>{product.name}</WrapperStyleNameProduct>
                        
                        <WrapperStyleTextSell>
                            Đã bán {product.sold || 0}+ 
                        </WrapperStyleTextSell>
                        
                        <WrapperPriceProduct>
                            {discount > 0 && (
                                <WrapperOriginalPrice>
                                    {originalPrice.toLocaleString('vi-VN')}đ
                                </WrapperOriginalPrice>
                            )}
                            <WrapperPriceTextProduct>
                                {price.toLocaleString('vi-VN')}đ
                            </WrapperPriceTextProduct>
                            {discount > 0 && (
                                <WrapperDiscount>
                                    -{discount}%
                                </WrapperDiscount>
                            )}
                        </WrapperPriceProduct>
                        
                        <WrapperInfoRow>
                            <WrapperInfoLabel>Vận Chuyển</WrapperInfoLabel>
                            <WrapperInfoContent>
                                <WrapperShipping>
                                    <CarOutlined style={{ fontSize: '20px', color: '#326e51' }}/>
                                    <span>Nhận từ {startDateString} - {endDateString} (Phí ship 0đ)</span>
                                </WrapperShipping>
                            </WrapperInfoContent>
                        </WrapperInfoRow>
                        
                        <WrapperInfoRow>
                            <WrapperInfoLabel>Loại:</WrapperInfoLabel>
                            <WrapperInfoContent>
                                <WrapperVariationGroup>
                                    {product.variations.map((variation) => (
                                        <WrapperVariationButton
                                            key={variation.sku}
                                            className={selectedVariation.sku === variation.sku ? 'active' : ''}
                                            onClick={() => {
                                                if (variation.stockQuantity > 0) {
                                                    handleVariationClick(variation)
                                                }
                                            }}
                                            disabled={variation.stockQuantity === 0}
                                        >
                                            {variation.name}
                                        </WrapperVariationButton>
                                    ))}
                                </WrapperVariationGroup>
                            </WrapperInfoContent>
                        </WrapperInfoRow>

                        <WrapperInfoRow>
                            <WrapperInfoLabel>An Tâm Mua Sắm</WrapperInfoLabel>
                            <Popover 
                                content={guaranteeContent} 
                                trigger="hover" 
                                placement="bottomLeft"
                            >
                                <WrapperGuarantee style={{ cursor: 'pointer' }}>
                                    <SafetyOutlined style={{ color: '#d0011b', fontSize: '16px' }} />
                                    <span>Trả hàng miễn phí 15 ngày · Chính hãng 100%</span>
                                    <DownOutlined style={{ fontSize: '12px', color: '#888' }} />
                                </WrapperGuarantee>
                            </Popover>
                        </WrapperInfoRow>

                        <Row style={{ marginTop: '20px' }}>
                            <WrapperQualityLabel>Số lượng:</WrapperQualityLabel>
                            <WrapperQualityProduct>
                                <WrapperBtnQualityProduct onClick={decreaseQuantity}>
                                    <MinusOutlined />
                                </WrapperBtnQualityProduct>
                                <WrapperInputNumber 
                                    min={1} 
                                    max={maxStock}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    size="middle"
                                />
                                <WrapperBtnQualityProduct onClick={increaseQuantity}>
                                    <PlusOutlined />
                                </WrapperBtnQualityProduct>
                                <WrapperStockText>
                                    (Còn {maxStock} sản phẩm)
                                </WrapperStockText>
                            </WrapperQualityProduct>
                        </Row>
                        
                        <WrapperButtonRow>
                            <AddToCartButton 
                                size="large"
                                onClick={handleAddToCart}
                                icon={<ShoppingCartOutlined />}
                                disabled={maxStock === 0}
                            >
                                Thêm vào giỏ hàng
                            </AddToCartButton>
                            <BuyNowButton 
                                size="large"
                                icon={<SolutionOutlined />}
                                onClick={handleBuyNow}
                                disabled={maxStock === 0}
                            >
                                Mua Ngay
                            </BuyNowButton>
                        </WrapperButtonRow>
                        
                    </WrapperStyleColInfo>
                </Row>
            </WrapperLayout>
            
            <WrapperLayout style={{ marginTop: '20px' }}>
                <WrapperDescription>
                    <h2>Mô tả sản phẩm</h2>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </WrapperDescription>
            </WrapperLayout>
        </WrapperContainer>
    );
};

export default ProductDetailPage;