import productApi from 'apis/productApi';
import RelatedProductList from 'components/ProductDetail/RelatedProductList';
import constants from 'constants/index';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

RelatedProduct.defaultProps = {
  id: "",
  type: 0,
  brand: "",
  title: "",
  span: { span: 24, xs: 24, sm: 12, md: 8, lg: 6, xl: 4, xxl: 4 },
};

function RelatedProduct(props) {
  const { id, type, brand, span, title } = props;
  const [productList, setProductList] = useState([]);

  // Lấy sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    const getRelatedProducts = async () => {
      try {
        const response = await productApi.getProductList(
          type,
          brand,
          constants.MAX_RELATED_PRODUCTS,
          id
        );
        if (response && isSubscribe) {
          setProductList(response.data.data);
        }
      } catch (error) {
        throw error;
      }
    };
    getRelatedProducts();

    return () => {
      isSubscribe = false;
    };
  }, [type, brand, id]);

  // Lấy sản phẩm
  // useEffect(() => {
  //   let isSubscribe = true;
  //   const getRelatedProducts = async () => {
  //     try {
  //       const response = await statisticApi.getTopProductOrder();
  //       if (response && isSubscribe) {
  //         setProductList(response.data.data);
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   };
  //   getRelatedProducts();

  //   return () => {
  //     isSubscribe = false;
  //   };
  // }, []);
  return (
    <>
      {productList && productList.length > 0 && (
        <RelatedProductList list={productList} span={span} title={title} />
      )}
    </>
  );
}

RelatedProduct.propTypes = {
  // loại, nhãn hiệu sản phẩm tương tự - sp đó
  id: PropTypes.string,
  type: PropTypes.number,
  brand: PropTypes.string,
  title: PropTypes.string,
  span: PropTypes.object,
};

export default RelatedProduct;
