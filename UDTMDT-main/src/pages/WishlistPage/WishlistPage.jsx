import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import axiosClient from '../../apis/axiosClient';
// 👇 1. Import hàm lấy ảnh để không bị lỗi hình
import { getImageUrl } from '../../services/ProductService';

import {
    WrapperContainer,
    WrapperContent,
    WrapperSidebar,
    WrapperMainContent,
    PageTitle,
    Box
} from '../ProfilePage/style';
import {
    EmptyState,
    EmptyIcon,
    EmptyDescription,
    ContinueButton,
    WishlistGrid,
    WishlistCard,
    WishlistCardImage,
    WishlistCardName,
    WishlistPrice,
    WishlistCardActions,
    ViewButton,
    RemoveButton
} from './style';

const WishlistPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Kiểm tra đăng nhập
    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            navigate('/sign-in');
            return;
        }
        setUserData(JSON.parse(userString));
    }, [navigate]);

    // Gọi API lấy danh sách yêu thích
    useEffect(() => {
        const fetchWishlist = async () => {
            setLoading(true);
            try {
                const res = await axiosClient.get('/api/users/wishlist');
                
                if (res.data && res.data.success) {
                    setWishlist(res.data.wishlist || []);
                } else {
                    setWishlist(res.data.data || []);
                }
            } catch (error) {
                console.error('Lỗi tải wishlist từ server:', error);
                
                const favString = localStorage.getItem('favorites');
                if (favString) {
                    try {
                        const favs = JSON.parse(favString);
                        const mapped = favs.map(f => ({
                            _id: f.product,
                            name: f.name,
                            price: f.price,
                            images: [f.image]
                        }));
                        setWishlist(mapped);
                    } catch (e) {
                        setWishlist([]);
                    }
                } else {
                    setWishlist([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    // Lắng nghe sự kiện update từ trang khác
    useEffect(() => {
        const onFavoritesUpdated = () => {
            const favString = localStorage.getItem('favorites');
            if (favString) {
                try {
                    const favs = JSON.parse(favString);
                    const mapped = favs.map(f => ({
                        _id: f.product,
                        name: f.name,
                        price: f.price,
                        images: [f.image]
                    }));
                    setWishlist(mapped);
                } catch (e) { /* ignore */ }
            }
        };
        window.addEventListener('favoritesUpdated', onFavoritesUpdated);
        return () => window.removeEventListener('favoritesUpdated', onFavoritesUpdated);
    }, []);

    const handleContinueShopping = useCallback(() => {
        navigate('/products');
    }, [navigate]);

    // 👇 2. SỬA LỖI NAVIGATE (Thêm chữ 's' vào product-details)
    const handleViewProduct = useCallback((productId) => {
        navigate(`/product-details/${productId}`);
    }, [navigate]);

    // Xử lý xóa sản phẩm
    const handleRemoveProduct = async (productId) => {
        try {
            await axiosClient.delete(`/api/users/wishlist/${productId}`);
            
            setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));

            const favString = localStorage.getItem('favorites');
            if (favString) {
                const favs = JSON.parse(favString);
                const filtered = favs.filter(f => f.product !== productId);
                localStorage.setItem('favorites', JSON.stringify(filtered));
            }

        } catch (error) {
            console.error('Lỗi xóa sản phẩm yêu thích:', error);
            setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
        }
    };

    if (!userData && !loading) {
        return null;
    }

    return (
        <WrapperContainer>
            <WrapperContent>
                <WrapperSidebar>
                    <ProfileSidebar />
                </WrapperSidebar>
                <WrapperMainContent>
                    <PageTitle>Danh sách yêu thích</PageTitle>
                    {loading ? (
                        <Box style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</Box>
                    ) : wishlist.length === 0 ? (
                        <EmptyState>
                            <EmptyIcon>:(</EmptyIcon>
                            <EmptyDescription>
                                Hãy <span role="img" aria-label="heart">❤️</span> sản phẩm bạn yêu thích khi mua sắm để xem lại thuận tiện nhất
                            </EmptyDescription>
                            <ContinueButton type="primary" onClick={handleContinueShopping}>
                                Tiếp tục mua sắm
                            </ContinueButton>
                        </EmptyState>
                    ) : (
                        <WishlistGrid>
                            {wishlist.map((product) => {
                                // Lấy ID an toàn
                                const productId = product._id || product.id || product;
                                const name = product.name || 'Sản phẩm';
                                const price = product.price || product.salePrice;
                                
                                // 👇 3. SỬA LỖI ẢNH: Dùng getImageUrl để nối domain backend vào
                                const rawImage = product.images?.[0]?.url || product.images?.[0] || product.image || '';
                                const imageSrc = getImageUrl(rawImage);

                                return (
                                    <WishlistCard key={productId}>
                                        <WishlistCardImage onClick={() => handleViewProduct(productId)} style={{ cursor: 'pointer' }}>
                                            <img src={imageSrc} alt={name} onError={(e) => {e.target.onerror = null; e.target.src="/placeholder.png"}} />
                                        </WishlistCardImage>
                                        
                                        <WishlistCardName onClick={() => handleViewProduct(productId)} style={{ cursor: 'pointer' }}>
                                            {name}
                                        </WishlistCardName>
                                        
                                        <WishlistPrice>
                                            {price ? price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                                        </WishlistPrice>
                                        
                                        <WishlistCardActions>
                                            <ViewButton type="primary" onClick={() => handleViewProduct(productId)}>
                                                Xem chi tiết
                                            </ViewButton>
                                            <RemoveButton onClick={() => handleRemoveProduct(productId)}>
                                                Xóa
                                            </RemoveButton>
                                        </WishlistCardActions>
                                    </WishlistCard>
                                );
                            })}
                        </WishlistGrid>
                    )}
                </WrapperMainContent>
            </WrapperContent>
        </WrapperContainer>
    );
};

export default WishlistPage;