import React, { useState, useEffect } from 'react';
import { Row, Col, Button, message, Popover, Image, notification } from 'antd';
import { 
    PlusOutlined, MinusOutlined, SafetyOutlined,
    CheckCircleOutlined, CarOutlined, DownOutlined,
    ShoppingCartOutlined, SolutionOutlined, HeartOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosClient from '../../apis/axiosClient';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slides/cartSlice';

import {
    WrapperContainer, WrapperLayout, WrapperStyleImageSmall, WrapperThumbnailGroup, WrapperStyleColImage,
    WrapperStyleColInfo, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct,
    WrapperOriginalPrice, WrapperDiscount, WrapperQualityProduct, WrapperBtnQualityProduct, WrapperInputNumber, 
    WrapperStockText, WrapperQualityLabel, WrapperDescription, WrapperInfoRow, WrapperInfoLabel, WrapperInfoContent,
    WrapperVariationGroup, WrapperVariationButton, WrapperShipping, WrapperGuarantee, WrapperButtonRow, AddToCartButton, BuyNowButton, FavoriteButton
} from './style';
import { ProductList, ProductCard, ProductImage, ProductInfo, ProductName, ProductPrice } from '../ProductsPage/style';

const ProductDetailPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const dispatch = useDispatch();
    
    // Sử dụng Hook message của Ant Design để hiển thị ổn định nhất
    const [messageApi, contextHolder] = message.useMessage();

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day} Th${month}`;
    };

    const checkLogin = () => {
        const token = localStorage.getItem('access_token');
        if (!token || token === 'null' || token === 'undefined') {
            messageApi.warning('Vui lòng đăng nhập để thực hiện chức năng này!');
            navigate('/sign-in', { state: { from: location.pathname } });
            return false;
        }
        return true;
    };

    // --- HÀM ĐÃ SỬA LOGIC ĐỂ KHỚP VỚI BACKEND ---
    const handleAddToFavorites = async () => {
        if (!checkLogin()) return;
        if (!product) return;

        try {
            // SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY:
            // 1. Dùng /api/products (số nhiều) để khớp với index.js
            // 2. Truyền ID sản phẩm vào URL để khớp với route backend
            const res = await axiosClient.post(`/api/products/add-to-wishlist/${product._id}`);
            
            // Logic xử lý phản hồi
            if (res.status === 'OK' || res.status === 200 || res.message) {
                messageApi.open({
                    type: 'success',
                    content: 'Đã thêm vào danh sách yêu thích!',
                    duration: 3,
                });
            } else {
                messageApi.success('Đã thêm thành công');
            }

        } catch (e) { 
            console.error('Lỗi API:', e);
            // Kiểm tra nếu lỗi do trùng lặp (đã có trong danh sách) thì vẫn báo thành công hoặc thông báo nhẹ
            if(e.response && e.response.status === 400) {
                 messageApi.info('Sản phẩm này đã có trong danh sách yêu thích của bạn.');
            } else {
                 messageApi.error('Lỗi kết nối khi thêm yêu thích'); 
            }
        }
    };
    // ------------------------------------

    const fetchProductDetails = async (productId) => {
        try {
            // Chỗ này dùng axios thường hoặc axiosClient đều được, nhưng URL phải đúng
            // Backend đang là /api/products (số nhiều)
            const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/products/${productId}`);
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
                fetchRelatedProducts(productData);
            }
        } catch (error) { 
            console.log(error);
        }
    };

    const fetchRelatedProducts = async (productData) => {
        if (!productData) return;
        const categoryName = productData.categoryName || (productData.category && productData.category.name) || null;
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        
        try {
            let items = [];
            if (categoryName && typeof categoryName === 'string') {
                const res = await axios.get(`${apiUrl}/api/products?category=${encodeURIComponent(categoryName)}&limit=8`);
                if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    items = res.data.data;
                }
            }
            if (items.length === 0) {
                const allRes = await axios.get(`${apiUrl}/api/products?page=1&limit=24`);
                const all = allRes.data?.data || [];
                items = all.filter(p => String(p.category) === String(productData.category));
            }
            const filtered = items.filter(p => String(p._id) !== String(productData._id)).slice(0, 8);
            setRelated(filtered);
        } catch (e) { setRelated([]); }
    };

    useEffect(() => {
        if (id) fetchProductDetails(id);
    }, [id]);

    const handleVariationClick = (variation) => {
        setSelectedVariation(variation);
        setMainImage(variation.image);
        setQuantity(1);
    };

    const maxStock = selectedVariation ? selectedVariation.stockQuantity : 0;

    const handleQuantityChange = (value) => {
        if (selectedVariation && value >= 1 && value <= maxStock) setQuantity(value);
    };
    const increaseQuantity = () => {
        if (selectedVariation && quantity < maxStock) setQuantity(quantity + 1);
    };
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleAddToCart = () => {
        if (!checkLogin()) return;
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
        
        messageApi.success("Đã thêm vào giỏ hàng!");

        setTimeout(async () => {
            try {
                const currentCart = JSON.parse(localStorage.getItem('cartItems') || '{"items": []}');
                const itemsToSave = currentCart.items.map(i => ({ ...i, amount: i.quantity }));
                await axiosClient.put('/api/users/update-cart', { cartItems: itemsToSave });
            } catch (e) { console.error("Lỗi sync giỏ hàng"); }
        }, 200);
    };

    const handleBuyNow = () => {
        if (!checkLogin()) return;
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
            state: { items: [item], subtotal: subtotal, total: total }
        });
    };

    if (!product || !selectedVariation) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Đang tải...</div>;
    }

    const price = selectedVariation.price;
    const originalPrice = selectedVariation.originalPrice;
    const discount = (originalPrice && price < originalPrice) ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    const today = new Date();
    const startDate = new Date(today); startDate.setDate(today.getDate() + 3);
    const endDate = new Date(today); endDate.setDate(today.getDate() + 5);
    const startDateString = formatDate(startDate);
    const endDateString = formatDate(endDate);

    const guaranteeContent = (
      <div style={{ maxWidth: '300px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>An tâm mua sắm</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <SafetyOutlined style={{ fontSize: '20px', color: '#d0011b' }} />
          <div><strong>Trả hàng miễn phí 15 ngày</strong><p style={{ fontSize: '13px', margin: 0 }}>Đổi trả miễn phí.</p></div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <CheckCircleOutlined style={{ fontSize: '20px', color: '#326e51' }} />
          <div><strong>Chính hãng 100%</strong><p style={{ fontSize: '13px', margin: 0 }}>Hoàn tiền nếu hàng giả.</p></div>
        </div>
      </div>
    );

    return (
        <WrapperContainer>
            {/* ContextHolder bắt buộc phải có để hiện thông báo */}
            {contextHolder}
            
            <WrapperLayout>
                <Row>
                    <WrapperStyleColImage span={10}>
                        <Image src={mainImage} alt={product.name} style={{ width: '100%', height: '450px', objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: '8px' }} />
                        <WrapperThumbnailGroup>
                            {product.variations.map((variation) => (
                                <WrapperStyleImageSmall
                                    key={variation.sku} src={variation.image} alt={variation.name}
                                    onClick={() => { if (variation.stockQuantity > 0) handleVariationClick(variation) }}
                                    className={selectedVariation.sku === variation.sku ? 'active' : ''}
                                    disabled={variation.stockQuantity === 0}
                                />
                            ))}
                        </WrapperThumbnailGroup>
                    </WrapperStyleColImage>

                    <WrapperStyleColInfo span={14}>
                        <WrapperStyleNameProduct>{product.name}</WrapperStyleNameProduct>
                        <WrapperStyleTextSell>Đã bán {product.sold || 0}+ </WrapperStyleTextSell>
                        <WrapperPriceProduct>
                            {discount > 0 && <WrapperOriginalPrice>{originalPrice.toLocaleString('vi-VN')}đ</WrapperOriginalPrice>}
                            <WrapperPriceTextProduct>{price.toLocaleString('vi-VN')}đ</WrapperPriceTextProduct>
                            {discount > 0 && <WrapperDiscount>-{discount}%</WrapperDiscount>}
                        </WrapperPriceProduct>
                        <WrapperInfoRow>
                            <WrapperInfoLabel>Vận Chuyển</WrapperInfoLabel>
                            <WrapperInfoContent><WrapperShipping><CarOutlined style={{ fontSize: '20px', color: '#326e51' }}/><span>Nhận từ {startDateString} - {endDateString}</span></WrapperShipping></WrapperInfoContent>
                        </WrapperInfoRow>
                        <WrapperInfoRow>
                            <WrapperInfoLabel>Loại:</WrapperInfoLabel>
                            <WrapperInfoContent>
                                <WrapperVariationGroup>
                                    {product.variations.map((variation) => (
                                        <WrapperVariationButton key={variation.sku} className={selectedVariation.sku === variation.sku ? 'active' : ''} onClick={() => { if (variation.stockQuantity > 0) handleVariationClick(variation) }} disabled={variation.stockQuantity === 0}>{variation.name}</WrapperVariationButton>
                                    ))}
                                </WrapperVariationGroup>
                            </WrapperInfoContent>
                        </WrapperInfoRow>
                        <WrapperInfoRow>
                            <WrapperInfoLabel>Dịch vụ</WrapperInfoLabel>
                            <Popover content={guaranteeContent} trigger="hover">
                                <WrapperGuarantee style={{ cursor: 'pointer' }}><SafetyOutlined style={{ color: '#d0011b' }} /><span>An tâm mua sắm</span><DownOutlined /></WrapperGuarantee>
                            </Popover>
                        </WrapperInfoRow>
                        <Row style={{ marginTop: '20px' }}>
                            <WrapperQualityLabel>Số lượng:</WrapperQualityLabel>
                            <WrapperQualityProduct>
                                <WrapperBtnQualityProduct onClick={decreaseQuantity}><MinusOutlined /></WrapperBtnQualityProduct>
                                <WrapperInputNumber min={1} max={maxStock} value={quantity} onChange={handleQuantityChange} size="middle" />
                                <WrapperBtnQualityProduct onClick={increaseQuantity}><PlusOutlined /></WrapperBtnQualityProduct>
                                <WrapperStockText>(Còn {maxStock} sản phẩm)</WrapperStockText>
                            </WrapperQualityProduct>
                        </Row>
                        <WrapperButtonRow>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <AddToCartButton size="large" onClick={handleAddToCart} icon={<ShoppingCartOutlined />} disabled={maxStock === 0}>Thêm vào giỏ hàng</AddToCartButton>
                                <FavoriteButton size="large" icon={<HeartOutlined />} onClick={handleAddToFavorites} disabled={maxStock === 0}>Thêm vào yêu thích</FavoriteButton>
                            </div>
                            <BuyNowButton size="large" icon={<SolutionOutlined />} onClick={handleBuyNow} disabled={maxStock === 0}>Mua Ngay</BuyNowButton>
                        </WrapperButtonRow>
                    </WrapperStyleColInfo>
                </Row>
            </WrapperLayout>
            <WrapperLayout style={{ marginTop: '20px' }}><WrapperDescription><h2>Mô tả sản phẩm</h2><div dangerouslySetInnerHTML={{ __html: product.description }} /></WrapperDescription></WrapperLayout>
            <WrapperLayout style={{ marginTop: '20px' }}><h3 style={{ margin: '0 0 15px 0' }}>SẢN PHẨM TƯƠNG TỰ</h3>
                {related.length > 0 ? (
                    <ProductList>
                        {related.map(p => {
                            const img = p.variations?.[0]?.image || p.images?.[0]?.url || '/placeholder.png';
                            const pr = p.variations?.[0]?.price || p.price || 0;
                            return (<ProductCard key={p._id} onClick={() => navigate(`/product-detail/${p._id}`)}><ProductImage src={img} alt={p.name} /><ProductInfo><ProductName>{p.name}</ProductName><ProductPrice>{pr.toLocaleString()}đ</ProductPrice></ProductInfo></ProductCard>)
                        })}
                    </ProductList>
                ) : (<div>Không có sản phẩm gợi ý.</div>)}
            </WrapperLayout>
        </WrapperContainer>
    );
};

export default ProductDetailPage;