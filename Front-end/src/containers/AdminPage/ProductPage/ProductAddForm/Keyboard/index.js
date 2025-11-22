import { Col, Form, Input, Row, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import React from "react";

const suffixColor = "#aaa";

const KEYBOARD_TYPES = [
  { type: 0, label: "Bàn phím thường" },
  { type: 1, label: "Bàn phím giả cơ" },
  { type: 2, label: "Bàn phím cơ" },
];
const KEYBOARD_COLORS = [
  { type: 0, label: "Đen" },
  { type: 1, label: "Bạc" },
  { type: 2, label: "Trắng" },
  { type: 3, label: "Hồng" },
  { type: 4, label: "Khác" },
];
const KEYBOARD_LED_COLORS = [
  { type: 0, label: "Không led" },
  { type: 1, label: "Đơn sắc" },
  { type: 2, label: "Rainbow" },
  { type: 3, label: "RGB" },
];

function Keyboard() {
  return (
    <Row gutter={[16, 16]}>
      {/* Loại bàn phím */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Loại bàn phím *">
            {KEYBOARD_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Màu bàn phím */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="color"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Màu bàn phím *">
            {KEYBOARD_COLORS.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*  kết nối  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connect"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Kết nối *"
            suffix={
              <Tooltip title="2.4 GHz Wireless">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Màu đèn led */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="ledColor"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Màu đèn led *">
            {KEYBOARD_LED_COLORS.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*  Kiểu switch  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeSwitch"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Kiểu switch *"
            suffix={
              <Tooltip title="Dare-U D Switch Brown">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Phím chức năng  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="funcKey"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Phím chức năng *"
            suffix={
              <Tooltip title="Có">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Kích thước  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="size"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Kích thước *"
            suffix={
              <Tooltip title="full size">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Keyboard;
