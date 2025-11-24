import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Table,
  Tooltip,
} from "antd";
import categoryApi from "apis/categoryApi";
import helpers from "helpers";
import React, { useEffect, useState } from "react";
import EditCategoryModal from "./EditCategoryModal";

const suffixColor = "#aaa";

function Category() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editModal, setEditModal] = useState({
    visible: false,
    category: null,
  });
  const [modalDel, setModalDel] = useState({ visible: false, _id: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  // fn: Hàm lấy danh sách danh mục (Tách ra để tái sử dụng)
  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryApi.getCategories();
      if (response) {
        // Kiểm tra cấu trúc data trả về. Thường là response.data hoặc response.data.data
        // Dựa trên code cũ của bạn là: const { data } = response.data;
        const data = response.data.data || []; 
        
        const listData = data.map((item, index) => {
          return { ...item, key: index }; // Nên dùng _id làm key nếu có
        });
        setList(listData);
        setIsLoading(false);
      }
    } catch (error) {
      message.error("Lấy danh sách danh mục thất bại.");
    }
    setIsLoading(false);
  };

  // useEffect: Gọi API khi component mount
  useEffect(() => {
    getCategories();
  }, []);

  // fn: Xử lý submit form thêm mới
  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      // values ở đây là object: { name: "Tên danh mục" }
      const response = await categoryApi.createCategory(values);
      if (response.status === 200 || response.status === 201) {
        message.success("Thêm danh mục sản phẩm thành công");
        form.resetFields(); // Xóa trắng ô nhập liệu
        getCategories(); // QUAN TRỌNG: Load lại bảng danh sách
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || "Thêm thất bại.");
      } else {
        message.error("Lỗi kết nối. Thử lại.");
      }
    }
    setIsSubmitting(false);
  };

  // event: xoá danh mục
  const onDelete = async (_id) => {
    try {
      const response = await categoryApi.deleteCategory(_id);
      if (response && response.status === 200) {
        message.success("Xoá thành công.");
        // Cập nhật lại state list thay vì gọi API để nhanh hơn
        const newList = list.filter((item) => item._id !== _id);
        setList(newList);
      }
    } catch (error) {
      message.error("Xoá thất bại, thử lại !");
    }
  };

  // event: cập nhật danh mục xong thì đóng modal và update list
  const onCloseEditModal = (newCategory) => {
    // Nếu có dữ liệu trả về từ modal (đã update thành công)
    if (newCategory) {
        const newList = list.map((item) =>
        item._id !== newCategory._id ? item : { ...item, ...newCategory }
        );
        setList(newList);
    }
    setEditModal({ visible: false, category: null });
  };

  // Cột của bảng
  const columns = [
    {
      title: "ID",
      key: "_id",
      dataIndex: "_id",
      width: 100,
      ellipsis: true, 
    },
    {
      title: "Tên danh mục",
      key: "name",
      dataIndex: "name",
      render: (name) => (
        <Tooltip title={name}>
            <span style={{ fontWeight: 500 }}>{helpers.reduceProductName(name, 40)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (text) => (
        <>
          <Tooltip title="Chỉnh sửa" placement="bottom">
            <EditOutlined
              onClick={() => {
                setEditModal({ visible: true, category: { ...text } });
              }}
              className="m-r-8 action-btn-product"
              style={{ color: "#3555c5", cursor: "pointer", fontSize: 18, marginRight: 12 }}
            />
          </Tooltip>

          <Tooltip title="Xóa" placement="bottom">
            <DeleteOutlined
              onClick={() => setModalDel({ visible: true, _id: text._id })}
              className="action-btn-product"
              style={{ color: "red", cursor: "pointer", fontSize: 18 }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <Spin
          tip="Đang tải danh sách danh mục ..."
          size="large"
          className="transform-center position-relative"
        />
      ) : (
        <div className="admin-category">
          <h1 className="t-center p-t-20">
            <b>Danh mục sản phẩm</b>
          </h1>

          {/* Form tạo danh mục */}
          <div className="m-l-20 m-b-20 p-20" style={{maxWidth: 800, margin: "0 auto"}}>
            <Form
              name="form"
              form={form}
              onFinish={onFinish}
              onFinishFailed={() => message.error("Vui lòng nhập tên danh mục!")}
              autoComplete="off"
              layout="inline" // Chuyển sang inline cho đẹp nếu muốn
            >
                <Row gutter={[16, 16]} style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Col span={16}>
                        <Form.Item
                            name="name"
                            style={{marginBottom: 0, width: '100%'}}
                            rules={[
                            { required: true, message: "Vui lòng nhập tên danh mục", whitespace: true },
                            ]}
                        >
                            <Input
                            size="large"
                            placeholder="Nhập tên danh mục mới *"
                            suffix={
                                <Tooltip title="Ví dụ: Laptop, Điện thoại">
                                <InfoCircleOutlined style={{ color: suffixColor }} />
                                </Tooltip>
                            }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item style={{marginBottom: 0}}>
                            <Button
                            loading={isSubmitting}
                            size="large"
                            type="primary"
                            htmlType="submit"
                            block
                            >
                            Thêm danh mục
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
          </div>

          {/* modal confirm delete category */}
          <Modal
            title="Xác nhận xoá danh mục"
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
                <b>Bạn có chắc chắn muốn xoá danh mục này không?</b>
            </div>
          </Modal>

          {/* Danh sách danh mục  */}
          <div className="p-20">
            <Table
                pagination={{
                pageSize: 10,
                position: ["bottomCenter"],
                showSizeChanger: false,
                }}
                className="admin-see-categories"
                columns={columns}
                dataSource={list}
                bordered
            />
          </div>

          {/* edit category modal */}
          <EditCategoryModal
            visible={editModal.visible}
            onClose={(value) => onCloseEditModal(value)}
            category={editModal.category}
          />
        </div>
      )}
    </>
  );
}

export default Category;