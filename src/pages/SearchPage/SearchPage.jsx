import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Spin, Pagination } from 'antd';
import CardComponent from '../../components/CardComponent/CardComponent';
import { WrapperProducts } from '../HomePage/style'; // Dùng chung style
import axios from 'axios';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho phân trang
  const [totalProducts, setTotalProducts] = useState(0); // Thêm state cho tổng số lượng
  const pageSize = 10;

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); 

  // Sử dụng useCallback để ổn định hàm fetchProducts
  const fetchProducts = useCallback(async (searchQuery, page) => {
    setLoading(true); 
    
    // Tích hợp page và limit vào query API
    const url = `http://localhost:8080/api/products?search=${searchQuery}&page=${page}&limit=${pageSize}`;

    try {
      const response = await axios.get(url);
      
      if (response.data && response.data.data) {
        setProducts(response.data.data);
        // *QUAN TRỌNG*: Lấy total từ API nếu có, nếu không thì dùng tạm data.length
        setTotalProducts(response.data.total || response.data.data.length); 
      } else {
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      setProducts([]);
      setTotalProducts(0);
    }
    setLoading(false);
  }, [pageSize]); // Phụ thuộc vào pageSize

  // Chạy lại khi query hoặc trang thay đổi
  useEffect(() => {
    // Nếu query thay đổi, reset về trang 1
    // (Đây là logic cần thiết, nhưng do `query` là dependency, 
    // ta cần đảm bảo `currentPage` chỉ thay đổi khi `query` thực sự thay đổi)
    
    // Logic fetch
    if (query) {
      // Khi query thay đổi, ta luôn reset currentPage về 1. 
      // Nhưng nếu đang ở trang 1, ta fetch ngay.
      if (currentPage === 1) {
        fetchProducts(query, currentPage);
      } else {
        // Nếu query thay đổi và đang không ở trang 1, reset về 1 để trigger fetch lần nữa
        setCurrentPage(1);
      }
    } else {
      setProducts([]);
      setTotalProducts(0);
      setCurrentPage(1);
    }
  }, [query, currentPage, fetchProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#efefef', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ width: '1270px', margin: '0 auto', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#333' }}>
          Kết quả tìm kiếm cho từ khóa: "**{query}**"
        </h3>
        <Spin spinning={loading}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <WrapperProducts>
              {products.length === 0 && !loading ? (
                <div style={{ textAlign: 'center', fontSize: '16px', padding: '50px' }}>
                  Không tìm thấy sản phẩm nào.
                </div>
              ) : (
                <Row gutter={[16, 16]}>
                  {products.map((product) => {
                    // Đọc dữ liệu từ 'variations'
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

                    return (
                      <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product._id}>
                        <CardComponent
                          id={product._id}
                          image={imageUrl} 
                          name={product.name}
                          price={price}
                          discount={discount}
                        />
                      </Col>
                    );
                  })}
                </Row>
              )}
            </WrapperProducts>
            
            {/* Chỉ hiển thị Pagination nếu có total > pageSize */}
            {totalProducts > pageSize && (
                <Pagination
                  current={currentPage}
                  total={totalProducts} 
                  pageSize={pageSize} 
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  style={{ textAlign: 'center', marginTop: '30px' }}
                />
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default SearchPage;