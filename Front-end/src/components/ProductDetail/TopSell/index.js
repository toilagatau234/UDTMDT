import statisticApi from "apis/statisticApi";
import RelatedProductList from "components/ProductDetail/RelatedProductList";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

ProductTopSell.defaultProps = {
  id: "",
  title: "",
  span: { span: 24, xs: 24, sm: 12, md: 8, lg: 6, xl: 4, xxl: 4 },
};

function ProductTopSell(props) {
  const { span, title } = props;
  const [productList, setProductList] = useState([]);

  // Lấy sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    const getRelatedProducts = async () => {
      try {
        const response = await statisticApi.getTopProductOrder2();
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
  }, []);

  return (
    <>
      {productList && productList.length > 0 && (
        <RelatedProductList list={productList} span={span} title={title} />
      )}
    </>
  );
}

ProductTopSell.propTypes = {
  // loại, nhãn hiệu sản phẩm tương tự - sp đó
  id: PropTypes.string,
  type: PropTypes.number,
  brand: PropTypes.string,
  title: PropTypes.string,
  span: PropTypes.object,
};

export default ProductTopSell;
