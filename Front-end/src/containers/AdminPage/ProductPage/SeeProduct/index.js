import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { message, Spin, Table, Tooltip, Modal } from "antd";
// XÓA: import Modal from "antd/lib/modal/Modal";
import adminApi from "apis/adminApi";
import productApi from "apis/productApi";
import helpers from "helpers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditProductModal from "./EditProductModal";

function generateFilterType() {
  let result = [];
  for (let i = 0; i < 16; ++i) {
    result.push({ value: i, text: helpers.convertProductType(i) });
  }
  return result;
}

function SeeProduct() {
  const [editModal, setEditModal] = useState({ visible: false, product: null });
  const [modalDel, setModalDel] = useState({ visible: false, _id: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  // ... (Giữ nguyên các hàm onDelete, onCloseEditModal, useEffect) ...
  // event: xoá sản phẩm
  const onDelete = async (_id) => {
    try {
      const response = await adminApi.removeProduct(_id);
      if (response && response.status === 200) {
        message.success("Xoá thành công.");
        const newList = list.filter((item) => item._id !== _id);
        setList(newList);
        // setTotal(total - 1);
      }
    } catch (error) {
      message.error("Xoá thất bại, thử lại !");
    }
  };

  // event: cập nhật sản phẩm
  const onCloseEditModal = (newProduct) => {
    const newList = list.map((item) =>
      item._id !== newProduct._id ? item : { ...item, ...newProduct }
    );
    setList(newList);
    setEditModal({ visible: false });
  };

  // event: Lấy toàn bộ danh sách sản phẩm
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    async function getProductList() {
      try {
        const response = await productApi.getAllProducts(-1);
        if (response && isSubscribe) {
          // SỬA: Kiểm tra kỹ cấu trúc response
          const listData = response.data.data || []; 
          const list = listData.map((item, index) => {
            return { ...item, key: item._id || index }; // Dùng _id làm key
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
        <Link target="_blank" to={`/product/${data._id}`}>
          {code}
        </Link>
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
    // ... (Giữ nguyên các cột Price, Type, Brand, Stock, Discount, Rate) ...
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
      title: "Thương hiệu",
      key: "brand",
      dataIndex: "brand",
      sorter: (a, b) => {
        if (a.brand < b.brand) return -1;
        if (a.brand > b.brand) return 1;
        return 0;
      },
      render: (brand) => (
        <Tooltip title={brand}>{helpers.reduceProductName(brand, 40)}</Tooltip>
      ),
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
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (text) => (
        <>
          <Tooltip title="Xóa" placement="left">
            <DeleteOutlined
              onClick={() => setModalDel({ visible: true, _id: text._id })}
              className="m-r-8 action-btn-product"
              style={{ color: "red" }}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa" placement="left">
            <EditOutlined
              onClick={() => {
                setEditModal({ visible: true, product: { ...text } });
              }}
              className="m-r-8 action-btn-product"
              style={{ color: "#444" }}
            />
          </Tooltip>

          <Tooltip title="Xem chi tiết" placement="left">
            {/* SỬA: Dùng Link thay vì a href */}
            <Link target="_blank" to={`/product/${text._id}`}>
              <EyeOutlined
                className="action-btn-product"
                style={{ color: "#444" }}
              />
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  // ... (Phần return giữ nguyên) ...
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
          <Modal
            title="Xác nhận xoá sản phẩm"
            visible={modalDel.visible}
            onOk={() => {
              onDelete(modalDel._id);
              setModalDel({ visible: false, _id: false });
            }}
            onCancel={() => setModalDel({ visible: false, _id: false })}
            okButtonProps={{ danger: true }}
            okText="Xoá"
            cancelText="Huỷ bỏ"
          >
            <div style={{display: 'flex', alignItems: 'center'}}>
                <WarningOutlined style={{ fontSize: 28, color: "#F7B217", marginRight: 10 }} />
                <b> Không thể khôi phục được, bạn có chắc muốn xoá ?</b>
            </div>
          </Modal>
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
          <EditProductModal
            visible={editModal.visible}
            onClose={(value) => onCloseEditModal(value)}
            product={editModal.product}
          />
        </>
      )}
    </>
  );
}

export default SeeProduct;