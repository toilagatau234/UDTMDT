import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
import React from "react";

const suffixColor = "#aaa";
const OPERATING_TYPES = [
  { type: 0, label: "Android" },
  { type: 1, label: "IOS" },
];
const CHARGEGATE_TYPES = [
  { type: 0, label: "USB Type-C" },
  { type: 1, label: "Lightning" },
  { type: 2, label: "Micro USB" },
];

function Mobile() {
  return (
    <Row gutter={[16, 16]}>
      {/* Màu sắc */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="color"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Màu sắc *"
            suffix={
              <Tooltip title="Đỏ/Red">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Loại màn hình */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeScreen"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Loại màn hình *"
            suffix={
              <Tooltip title="6.5' ">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Độ phân giải */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="resolution"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Độ phân giải *"
            suffix={
              <Tooltip title="2688 x 1242 Pixels">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Camera trước */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="beforeCamera">
          <Input
            size="large"
            placeholder="Camera trước"
            suffix={
              <Tooltip title="12MP">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Camera sau */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="afterCamera"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Camera sau *"
            suffix={
              <Tooltip title="2 x 12MP">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Chip CPU */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="cpu"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Chip CPU *"
            suffix={
              <Tooltip title="A13 Bionic">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Hệ điều hành */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="operating"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Hệ điều hành *">
            {OPERATING_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* ROM */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="rom" rules={[{ required: true, message: "Bắt buộc" }]}>
          <InputNumber
            style={{ width: "100%" }}
            step={4}
            size="large"
            min={0}
            max={10000}
            placeholder="ROM (GB) *"
          />
        </Form.Item>
      </Col>
      {/* RAM */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="ram" rules={[{ required: true, message: "Bắt buộc" }]}>
          <InputNumber
            style={{ width: "100%" }}
            step={2}
            size="large"
            min={0}
            max={64}
            placeholder="RAM (GB) *"
          />
        </Form.Item>
      </Col>

      {/* Dung lượng pin */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="pin"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Dung lượng pin *"
            suffix={
              <Tooltip title="3110 mAh">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Cổng sạc */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="chargeGate"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Cổng sạc *">
            {CHARGEGATE_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Kich Thước */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="size"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Kích Thước *"
            suffix={
              <Tooltip title="160.5 x 75.7 x 6.8 mm">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Mobile;
