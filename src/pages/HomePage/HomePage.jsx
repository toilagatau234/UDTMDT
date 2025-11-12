import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Pagination, Spin } from 'antd';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent';
import { WrapperTypeProduct, WrapperProducts } from './style';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

// Import slider
import slider1 from '../../assets/images/slider1.jpg';
import slider2 from '../../assets/images/slider2.jpg';
import slider3 from '../../assets/images/slider3.jpg';
import slider4 from '../../assets/images/slider4.jpg';
import slider5 from '../../assets/images/slider5.jpg';
import slider6 from '../../assets/images/slider6.jpg';
import slider7 from '../../assets/images/slider7.jpg';
import slider8 from '../../assets/images/slider8.jpg';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0); 
    const pageSize = 10; 

    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString(); 

    const fetchProducts = useCallback(async (page, currentSearchParamsString) => {
        setLoading(true);
        
        const currentParams = new URLSearchParams(currentSearchParamsString);
        currentParams.set('page', page);
        currentParams.set('limit', pageSize);

        try {
            const query = currentParams.toString();
            const response = await axios.get(`http://localhost:8080/api/products?${query}`);
            
            if (response.data && response.data.data) {
                setProducts(response.data.data);
                // Lấy total và currentPage từ API (Backend đã gửi)
                setTotalProducts(response.data.total || response.data.data.length); 
                // Có thể cập nhật currentPage/pageSize từ API để đồng bộ hoàn toàn
            } else {
                setProducts([]);
                setTotalProducts(0);
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProducts([]);
            setTotalProducts(0);
        }
        setLoading(false);
    }, [pageSize]);

    useEffect(() => {
        // Reset về trang 1 nếu filter thay đổi
        if (currentPage !== 1 && searchParamsString !== '') {
            setCurrentPage(1); 
        } 
        
        fetchProducts(currentPage, searchParamsString);
        
    }, [searchParamsString, currentPage, fetchProducts]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const productTypes = [
        'Kem Chống Nắng', 'Chăm sóc da mặt', 'Dụng cụ & Phụ kiện', 
        'Dưỡng da chuyên sâu', 'Khuyến mãi & Combo'
    ];
    const sliderImages = [
        slider1, slider2, slider3, slider4, 
        slider5, slider6, slider7, slider8
    ];

    return (
        <div style={{ width: '100%', backgroundColor: '#efefef' }}>
            
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {productTypes.map((item) => (
                        <TypeProduct name={item} key={item} />
                    ))}
                </WrapperTypeProduct>
            </div>

            <div style={{ width: '100%', backgroundColor: '#fff' }}>
                <div style={{ width: '1270px', margin: '0 auto', padding: '0 0 20px 0' }}>
                    <SliderComponent arrImage={sliderImages} />
                </div>
            </div>

            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperProducts>
                    <Row gutter={20}>
                        <Col span={5}>
                            <NavBarComponent />
                        </Col>
                        <Col span={19}>
                            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                                    Sản phẩm
                                </h2>
                                <Spin spinning={loading}>
                                    <Row gutter={[16, 16]}>
                                        {products.length > 0 ? products.map((product) => {
                                            if (!product.variations || product.variations.length === 0) {
                                                return null; 
                                            }
                                            const firstVariation = product.variations[0];
                                            const price = firstVariation.price;
                                            const originalPrice = firstVariation.originalPrice;
                                            let discount = 0;
                                            if (originalPrice && price < originalPrice) {
                                                discount = Math.round(((originalPrice - price) / originalPrice) * 100);
                                            }
                                            const imageUrl = firstVariation.image || product.images?.[0]?.url;

                                            // === TRÍCH XUẤT RATING TỪ reviewSummary ===
                                            const averageRating = product.reviewSummary?.averageRating || 0;
                                            // ==========================================

                                            return (
                                                <Col xs={24} sm={12} md={12} lg={8} xl={6} key={product._id}>
                                                    <CardComponent
                                                        id={product._id}
                                                        image={imageUrl} 
                                                        name={product.name}
                                                        price={price}
                                                        discount={discount}
                                                        sold={product.sold || 0} // Truyền sold
                                                        rating={averageRating} // <-- TRUYỀN RATING CHÍNH XÁC
                                                    />
                                                </Col>
                                            );
                                        }) : (
                                            <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>
                                                Không tìm thấy sản phẩm phù hợp.
                                            </div>
                                        )}
                                    </Row>
                                </Spin>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    marginTop: '30px',
                                    paddingBottom: '20px'
                                }}>
                                    <Pagination
                                        current={currentPage}
                                        total={totalProducts} 
                                        pageSize={pageSize}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </WrapperProducts>
            </div>
        </div>
    );
};

export default HomePage;