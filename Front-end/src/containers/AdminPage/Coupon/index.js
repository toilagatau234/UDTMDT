import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Table, Tooltip } from 'antd';
import couponApi from 'apis/couponApi';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

function CouponManagement() {
  const [list, setList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  // Lấy danh sách
  const getCoupons = async () => {
    try {
      const res = await couponApi.getCoupons();
      if (res) setList(res.data.list);
    } catch (error) {
      message.error('Lỗi lấy danh sách');
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  // Thêm mã
  const onAddCoupon = async (values) => {
    try {
      const { expireDate, ...rest } = values;
      const data = { ...rest, expireDate: expireDate.format('YYYY-MM-DD') };
      await couponApi.createCoupon(data);
      message.success('Thêm mã thành công');
      setIsVisible(false);
      form.resetFields();
      getCoupons();
    } catch (error) {
      message.error(error.response?.data?.message || 'Thêm thất bại');
    }
  };

  // Xóa mã
  const onDelete = async (id) => {
    try {
      await couponApi.deleteCoupon(id);
      message.success('Đã xóa');
      getCoupons();
    } catch (error) {
      message.error('Lỗi xóa');
    }
  };

  const columns = [
    { title: 'Mã Code', dataIndex: 'code', key: 'code', render: text => <b>{text}</b> },
    { title: 'Giảm giá (%)', dataIndex: 'discount', key: 'discount', render: text => `${text}%` },
    { title: 'Lượt dùng còn lại', dataIndex: 'usageLimit', key: 'usageLimit' },
    { title: 'Hạn sử dụng', dataIndex: 'expireDate', key: 'expireDate', render: date => moment(date).format('DD/MM/YYYY') },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="Xóa">
          <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDelete(record._id)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="p-32">
      <h2 className="m-b-20">Quản lý Mã giảm giá</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsVisible(true)} className="m-b-20">
        Thêm mã mới
      </Button>
      <Table dataSource={list} columns={columns} rowKey="_id" />

      {/* Modal Thêm */}
      <Modal
        title="Thêm Mã Giảm Giá"
        visible={isVisible}
        onCancel={() => setIsVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onAddCoupon} layout="vertical">
          <Form.Item name="code" label="Mã Code" rules={[{ required: true, message: 'Nhập mã code' }]}>
            <Input placeholder="VD: SALE50" style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discount" label="% Giảm giá" rules={[{ required: true, message: 'Nhập %' }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usageLimit" label="Số lượt dùng" rules={[{ required: true, message: 'Nhập số lượt' }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="expireDate" label="Hạn sử dụng" rules={[{ required: true, message: 'Chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabledDate={(current) => current && current < moment().endOf('day')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CouponManagement;