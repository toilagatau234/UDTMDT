import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Pagination, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import TypeProduct from '../../components/TypeProduct/TypeProduct';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent';
import { WrapperTypeProduct, WrapperProducts } from './style';

import slider1 from '../../assets/images/slider1.jpg';
import slider2 from '../../assets/images/slider2.jpg';
import slider3 from '../../assets/images/slider3.jpg';
import slider4 from '../../assets/images/slider4.jpg';
import slider5 from '../../assets/images/slider5.jpg';
import slider6 from '../../assets/images/slider6.jpg';
import slider7 from '../../assets/images/slider7.jpg';
import slider8 from '../../assets/images/slider8.jpg';

/**
 * HomePage
 * =====================
 * Trang chủ hiển thị sản phẩm, slider và các loại sản phẩm.
 * Chức năng chính:
 * - Hiển thị danh sách sản phẩm theo trang, hỗ trợ phân trang.
 * - Slider hiển thị hình ảnh nổi bật.
 * - Danh sách loại sản phẩm và nav bar điều hướng.
 * - Tải sản phẩm theo query params từ URL (tìm kiếm, lọc,...).
 */
const HomePage = () => {
  // State quản lý danh sách sản phẩm, loading và phân trang
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 8; // Số sản phẩm mỗi trang

  // Lấy query params từ URL
  const [searchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  const prevSearchParams = useRef(searchParamsString); // Lưu params trước đó để reset page khi thay đổi

  /**
   * fetchProducts
   * -------------
   * Lấy danh sách sản phẩm từ server theo page và query params.
   * Sử dụng useCallback để tránh tạo lại hàm không cần thiết.
   */
  const fetchProducts = useCallback(async (page, currentSearchParamsString) => {
    setLoading(true);

    const currentParams = new URLSearchParams(currentSearchParamsString);
    currentParams.set('page', page);
    currentParams.set('limit', pageSize);

    try {
      const response = await axios.get(`http://localhost:8080/api/products?${currentParams.toString()}`);
      const data = response.data?.data || [];
      setProducts(data);
      setTotalProducts(response.data?.total || data.length);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  /**
   * useEffect - Tải sản phẩm khi query params hoặc page thay đổi
   * ------------------------------------------------------------
   * Nếu query params thay đổi so với lần trước, reset page về 1.
   */
  useEffect(() => {
    if (prevSearchParams.current !== searchParamsString) {
      setCurrentPage(1);
      prevSearchParams.current = searchParamsString;
      fetchProducts(1, searchParamsString);
    } else {
      fetchProducts(currentPage, searchParamsString);
    }
  }, [searchParamsString, currentPage, fetchProducts]);

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Danh sách loại sản phẩm hiển thị ở trên cùng
  const productTypes = [
    'Kem Chống Nắng',
    'Chăm sóc da mặt',
    'Dụng cụ & Phụ kiện',
    'Dưỡng da chuyên sâu',
    'Khuyến mãi & Combo'
  ];

  // Hình ảnh slider
  const sliderImages = [
    slider1, slider2, slider3, slider4,
    slider5, slider6, slider7, slider8
  ];

  return (
    <div style={{ width: '100%', backgroundColor: '#efefef' }}>
      
      {/* Loại sản phẩm */}
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperTypeProduct>
          {productTypes.map(name => <TypeProduct name={name} key={name} />)}
        </WrapperTypeProduct>
      </div>

      {/* Slider */}
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '1270px', margin: '0 auto', paddingBottom: 20 }}>
          <SliderComponent arrImage={sliderImages} />
        </div>
      </div>

      {/* Danh sách sản phẩm và nav bar */}
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperProducts>
          <Row gutter={20}>
            {/* Sidebar navigation */}
            <Col span={5}>
              <NavBarComponent />
            </Col>

            {/* Danh sách sản phẩm */}
            <Col span={19}>
              <div style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
                <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Sản phẩm</h2>

                <Spin spinning={loading}>
                  <Row gutter={[16, 16]}>
                    {products.length > 0 ? products.map(product => {
                      // Nếu không có variations, bỏ qua
                      if (!product.variations?.length) return null;

                      const firstVariation = product.variations[0];
                      const price = firstVariation.price;
                      const originalPrice = firstVariation.originalPrice;
                      const discount = originalPrice && price < originalPrice
                        ? Math.round(((originalPrice - price) / originalPrice) * 100)
                        : 0;
                      const imageUrl = firstVariation.image || product.images?.[0]?.url;
                      const averageRating = product.reviewSummary?.averageRating || 0;

                      return (
                        <Col xs={24} sm={12} md={12} lg={8} xl={6} key={product._id}>
                          <CardComponent
                            id={product._id}
                            image={imageUrl}
                            name={product.name}
                            price={price}
                            discount={discount}
                            sold={product.sold || 0}
                            rating={averageRating}
                          />
                        </Col>
                      );
                    }) : (
                      <div style={{ textAlign: 'center', width: '100%', padding: 50 }}>
                        Không tìm thấy sản phẩm phù hợp.
                      </div>
                    )}
                  </Row>
                </Spin>

                {/* Phân trang */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30, paddingBottom: 20 }}>
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
