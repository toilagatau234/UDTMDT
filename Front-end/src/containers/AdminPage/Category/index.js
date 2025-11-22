import {
  InfoCircleOutlined,
  DeleteOutlined,
  EditOutlined,
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
  const [editModal, setEditModal] = useState({ visible: false, category: null });
  const [modalDel, setModalDel] = useState({ visible: false, _id: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  // Xử lý lấy danh sách danh mục
  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true)
    const getCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        if (response && isSubscribe) {
          const { data } = response.data;
          const list = data.map((item, index) => {
            return { ...item, key: index };
          });
          setList(list);
          setIsLoading(false);
        }
      } catch (error) {
        if(isSubscribe) setIsLoading(false)
        message.error("Lấy danh sách sản phẩm thất bại.");
      }
    };

    getCategories();
    return () => (isSubscribe = false);
  }, []);

  // fn: Xử lý submit form
  const onFinish = async (name) => {
    try {
      setIsSubmitting(true);
      const response = await categoryApi.createCategory(name);
      if (response.status === 200) {
        setIsSubmitting(false);
        message.success("Thêm danh mục sản phẩm thành công");
        form.resetFields();
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error("Thêm danh mục sản phẩm thất bại. Thử lại");
      }
    }
  };

   // event: xoá sản phẩm
   const onDelete = async (_id) => {
    try {
      const response = await categoryApi.deleteCategory(_id);
      if (response && response.status === 200) {
        message.success("Xoá thành công.");
        const newList = list.filter((item) => item._id !== _id);
        setList(newList);
      }
    } catch (error) {
      message.error("Xoá thất bại, thử lại !");
    }
  };

   // event: cập nhật sản phẩm
   const onCloseEditModal = (newCategory) => {
    const newList = list.map((item) =>
      item._id !== newCategory._id ? item : { ...item, ...newCategory }
    );
    setList(newList);
    setEditModal({ visible: false });
  };

  // Cột của bảng
  const columns = [
    {
      title: "ID",
      key: "_id",
      dataIndex: "_id",
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
      title: "Hành động",
      key: "actions",
      fixed: "right",
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
                setEditModal({ visible: true, category: { ...text } });
              }}
              className="m-r-8 action-btn-product"
              style={{ color: "#444" }}
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
          <div className="m-l-20 m-b-20">
            <Form
              name="form"
              form={form}
              onFinish={onFinish}
              onFinishFailed={() => message.error("Lỗi. Kiểm tra lại form")}
              autoComplete="off"
            >
              <Row gutter={[16, 16]}>
                <Col span={12} md={8} xl={6} xxl={4}>
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Bắt buộc", whitespace: true },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Danh mục sản phẩm *"
                      suffix={
                        <Tooltip title="">
                          <InfoCircleOutlined style={{ color: suffixColor }} />
                        </Tooltip>
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12} md={8} xl={6} xxl={4}>
                  <Form.Item>
                    <Button
                      loading={isSubmitting}
                      size="large"
                      type="primary"
                      htmlType="submit"
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
            <WarningOutlined style={{ fontSize: 28, color: "#F7B217" }} />
            <b> Không thể khôi phục được, bạn có chắc muốn xoá ?</b>
          </Modal>
          {/* Danh sách danh mục  */}
          <Table
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
              showSizeChanger: false,
            }}
            className="admin-see-categories"
            columns={columns}
            dataSource={list}
          />
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