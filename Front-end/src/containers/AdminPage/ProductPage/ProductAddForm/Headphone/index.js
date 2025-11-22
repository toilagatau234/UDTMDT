import { Col, Form, Input, Row, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React from "react";

const suffixColor = "#aaa";

const HEADPHONE_TYPES = [
  { type: 0, label: "Over-ear" },
  { type: 1, label: "In-ear" },
  { type: 2, label: "On-ear" },
  { type: 3, label: "KHT" },
];
const COLOR_TYPES = [
  { type: 0, label: "Đen" },
  { type: 1, label: "Bạc" },
  { type: 2, label: "Trắng" },
  { type: 3, label: "Hồng" },
  { type: 4, label: "Đỏ" },
  { type: 5, label: "Xám" },
  { type: 6, label: "Xanh" },
  { type: 7, label: "Vàng" },
];
const CONNECT_TYPES = [
  { type: 0, label: "Tai nghe không dây" },
  { type: 1, label: "Tai nghe có dây" },
];
// const CONNECTION_STD = [
//   { type: 0, label: "3.5mm" },
//   { type: 1, label: "bluetooth" },
//   { type: 2, label: "USB" },
//   { type: 3, label: "bluetooth 4.0" },
//   { type: 4, label: "bluetooth 5.0" },
//   { type: 5, label: "2.4GHz Wireless" },
//   { type: 6, label: "USB Type-C" },
// ];
const MICROPHONE_TYPES = [
  { type: 0, label: "Không" },
  { type: 1, label: "Có" },
];

function Headphone() {
  return (
    <Row gutter={[16, 16]}>
      {/* Loại tai nghe */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Loại tai nghe *">
            {HEADPHONE_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Màu sắc */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="color"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Màu sắc *">
            {COLOR_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Kết nối  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connect"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Kết nối *"
            suffix={
              <Tooltip title="USB 2.0, Wireless">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Loại kết nối  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeConnect"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Loại kết nối *">
            {CONNECT_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Đèn Leb  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="isLed">
          <Input
            size="large"
            placeholder="Đèn Leb *"
            suffix={
              <Tooltip title="RGB">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Microphone  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="microphone"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Microphone  *">
            {MICROPHONE_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Headphone;
