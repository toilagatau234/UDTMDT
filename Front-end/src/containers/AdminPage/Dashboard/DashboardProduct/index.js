import { message, Spin, Table, Tooltip } from "antd";
import statisticApi from "apis/statisticApi";
import helpers from "helpers";
import React, { useEffect, useState } from "react";

function generateFilterType() {
  let result = [];
  for (let i = 0; i < 16; ++i) {
    result.push({ value: i, text: helpers.convertProductType(i) });
  }
  return result;
}

function DashboardProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  // event: Lấy toàn bộ danh sách sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    async function getProductList() {
      try {
        const response = await statisticApi.getProductListRevenue2(-1);
        if (response && isSubscribe) {
          const { data } = response.data;
          const list = data.map((item, index) => {
            return { ...item, key: index };
          });
          setList(list);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
        message.error("Lấy danh sách sản phẩm thất bại.");
      }
    }
    getProductList();

    return () => {
      isSubscribe = false;
    };
  }, []);

  // Cột của bảng
  const columns = [
    {
      title: "Mã",
      key: "code",
      dataIndex: "code",
      render: (code, data) => (
        <a target="blank" href={`/product/${data._id}`}>
          {code}
        </a>
      ),
    },
    {
      title: "Tên",
      key: "name",
      dataIndex: "name",
      render: (name) => (
        <Tooltip title={name}>{helpers.reduceProductName(name, 40)}</Tooltip>
      ),
    },
    {
      title: "Giá",
      key: "price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <h3 style={{ color: "#4F55C5" }}>
          {price ? helpers.formatProductPrice(price) : "Liên hệ"}
        </h3>
      ),
    },
    {
      title: "Loại",
      key: "type",
      dataIndex: "type",
      filters: generateFilterType(),
      onFilter: (value, record) => record.type === value,
      render: (type) => helpers.convertProductType(type),
    },
    {
      title: "Tồn kho",
      key: "stock",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Mức giảm giá",
      key: "discount",
      dataIndex: "discount",
      sorter: (a, b) => a.discount - b.discount,
      render: (discount) => `${discount} %`,
    },
    {
      title: "Đánh giá",
      key: "rate",
      dataIndex: "rate",
      render: (rate) => helpers.calStar(rate).toFixed(1),
    },
    {
      title: "Đã bán",
      key: "count",
      dataIndex: "count",
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: "Danh thu",
      key: "totalPrice",
      dataIndex: "totalPrice",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (totalPrice) => (
        <h3 style={{ color: "#4F55C5" }}>
          {helpers.formatProductPrice(totalPrice)}
        </h3>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <Spin
          tip="Đang tải danh sách sản phẩm ..."
          size="large"
          className="transform-center position-relative "
        />
      ) : (
        <>
          {/* table show product list */}
          <Table
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
              showSizeChanger: false,
            }}
            className="admin-see-product"
            columns={columns}
            dataSource={list}
          />
        </>
      )}
    </>
  );
}

export default DashboardProduct;
