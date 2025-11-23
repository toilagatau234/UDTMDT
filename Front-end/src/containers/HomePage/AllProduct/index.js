import { Col, Pagination, Row, Spin } from 'antd';
import productApi from 'apis/productApi';
import ProductView from 'components/ProductView';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AllProduct() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    const getAllProducts = async () => {
      try {
        const reponse = await productApi.getAllProducts(page, 12);
        if (reponse && isSubscribe) {
          const { data, count } = reponse.data;
          setList(data);
          setTotal(count);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    getAllProducts();

    return () => (isSubscribe = false);
  }, [page]);

  // Hiển thị sản phẩm
  const showProducts = (list) => {
    list = list ? list : [];
    return list.map((product, index) => {
      const { avt, name, price, discount, stock, _id } = product;
      return (
        <Col key={index} span={24} sm={12} lg={8} xl={6}>
          <Link to={`/product/${_id}`}>
            <ProductView
              className="m-auto"
              name={name}
              price={price}
              stock={stock}
              avtUrl={avt}
              discount={discount}
              height={400}
            />
          </Link>
        </Col>
      );
    });
  };

  return (
    <Row gutter={[16, 16]} className="p-16" style={{ minHeight: 400 }}>
      <Col span={24}>
        <h2 className="font-weight-700 underline-title">Tất cả sản phẩm</h2>
      </Col>
      {isLoading ? (
        <Spin
          className="transform-center"
          tip="Đang tải sản phẩm ..."
          size="large"
        />
      ) : (
        <>
          {showProducts(list)}
          <Col span={24}>
            <Pagination
              className="t-center"
              current={page}
              pageSize={12}
              total={total}
              onChange={(e) => setPage(e)}
              showSizeChanger={false}
            />
          </Col>
        </>
      )}
    </Row>
  );
}

export default AllProduct;
