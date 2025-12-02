import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
// 👇 1. IMPORT AXIOSCLIENT (Thay vì axios thường)
import axiosClient from '../../apis/axiosClient';

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
                // 👇 2. SỬA API CALL: Dùng axiosClient và đường dẫn ngắn gọn
                // Backend sẽ tự lấy ID từ Token, không cần truyền ID lên URL
                const res = await axiosClient.get('/api/users/wishlist');
                
                if (res.data && res.data.success) {
                    setWishlist(res.data.wishlist || []);
                } else {
                    // Fallback nếu API trả về cấu trúc khác
                    setWishlist(res.data.data || []);
                }
            } catch (error) {
                console.error('Lỗi tải wishlist từ server:', error);
                
                // Nếu lỗi 401 (Token hết hạn), axiosClient có thể đã xử lý, nhưng ta fallback về localStorage để hiển thị tạm
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
    }, []); // Chạy 1 lần khi mount

    // Lắng nghe sự kiện update từ trang khác (giữ nguyên logic của bạn)
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

    const handleViewProduct = useCallback((productId) => {
        navigate(`/product-detail/${productId}`);
    }, [navigate]);

    // Xử lý xóa sản phẩm
    const handleRemoveProduct = async (productId) => {
        try {
            // 👇 3. SỬA API DELETE: Dùng axiosClient
            await axiosClient.delete(`/api/users/wishlist/${productId}`);
            
            // Cập nhật state ngay lập tức
            setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));

            // Đồng bộ xóa cả trong localStorage (nếu có)
            const favString = localStorage.getItem('favorites');
            if (favString) {
                const favs = JSON.parse(favString);
                const filtered = favs.filter(f => f.product !== productId);
                localStorage.setItem('favorites', JSON.stringify(filtered));
            }

        } catch (error) {
            console.error('Lỗi xóa sản phẩm yêu thích:', error);
            // Fallback xóa local nếu server lỗi
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
                                const productId = product._id || product;
                                const name = product.name || 'Sản phẩm';
                                const price = product.price || product.salePrice;
                                const imageSrc = product.images?.[0]?.url || product.images?.[0] || '/placeholder.png';
                                return (
                                    <WishlistCard key={productId}>
                                        <WishlistCardImage>
                                            <img src={imageSrc} alt={name} />
                                        </WishlistCardImage>
                                        <WishlistCardName>{name}</WishlistCardName>
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