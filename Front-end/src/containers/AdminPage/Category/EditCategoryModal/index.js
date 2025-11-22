import { Col, Form, Input, message, Modal, Row } from "antd";
import categoryApi from "apis/categoryApi";
import React, { useState } from "react";
import PropTypes from "prop-types";

function EditCategoryModal(props) {
  const { visible, onClose, category } = props;
  const { _id, name } = category ? category : {};
  const initValues = { _id, name };

  const [isUpdating, setIsUpdating] = useState(false);

  // fn: Xử lý cập nhật danh mục
  const onEdit = async (value) => {
    try {
      setIsUpdating(true);
      const response = await categoryApi.updateCategory(value);
      if (response && response.status === 200) {
        message.success("Cập nhật thành công");
        onClose(value);
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
    }

    setIsUpdating(false);
  };
  return (
    <Modal
      className="edit-category-modal"
      destroyOnClose={true}
      maskClosable={false}
      visible={visible}
      okText="Cập nhật"
      cancelText="Huỷ bỏ"
      onCancel={onClose}
      okButtonProps={{ form: "editForm", htmlType: "submit" }}
      title="Chỉnh sửa thông tin danh mục"
      confirmLoading={isUpdating}
      width={1000}
      centered
    >
      <Form
        initialValues={initValues}
        name="editForm"
        onFinish={(value) => onEdit(value)}
      >
        <Row gutter={[16, 16]}>
          {/* Id */}
          <Col span={12}>
            <Form.Item name="_id">
              <Input disabled size="large" placeholder="ID" />
            </Form.Item>
          </Col>

          {/* Tên sản phẩm */}
          <Col span={12}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Bắt buộc", whitespace: true },
              ]}
            >
              <Input size="large" placeholder="Tên danh mục *" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

EditCategoryModal.propTypes = {
  onClose: PropTypes.func,
  product: PropTypes.object,
  visible: PropTypes.bool,
};

export default EditCategoryModal;