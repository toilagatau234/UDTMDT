import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";

const suffixColor = "#aaa";

const MOUSE_TYPES = [
  { type: 0, label: "Có dây" },
  { type: 1, label: "Không dây" },
];

const MOUSE_LEDS = [
  { type: true, label: "Có led" },
  { type: false, label: "Không Led" },
];

const COLOR_TYPES = [
  { type: 0, label: "Đen" },
  { type: 1, label: "Bạc" },
  { type: 2, label: "Trắng" },
  { type: 3, label: "Hồng" },
  { type: 4, label: "Đỏ" },
  { type: 5, label: "Xám" },
];

const TYPESENSOR_TYPES = [
  { type: 0, label: "Optical" },
  { type: 1, label: "Laser" },
];

function Mouse() {
  return (
    <Row gutter={[16, 16]}>
      {/* Loại Chuột */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeConnect"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Loại Chuột *">
            {MOUSE_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Đèn Led */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="isLed"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Đèn Led *">
            {MOUSE_LEDS.map((item, index) => (
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
      {/* kết nối */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connect"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
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
      {/* Độ phân giải (CPI/DPI) */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="resolution"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Độ phân giải *"
            suffix={
              <Tooltip title={`12000DPI`}>
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Dạng cảm biến */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeSensor"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Dạng cảm biến *">
            {TYPESENSOR_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Tên cảm biến  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="nameSensor">
          <Input
            size="large"
            placeholder="Tên cảm biến *"
            suffix={
              <Tooltip title={`PMW3327`}>
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Số nút bấm  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="numOfButton"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={1}
            size="large"
            min={0}
            max={10}
            placeholder="Số nút bấm *"
          />
        </Form.Item>
      </Col>
      {/* Kích thước  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="size"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Kích thước *"
            suffix={
              <Tooltip title={`10.75 x 5.92 x 3.83"`}>
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Mouse;
