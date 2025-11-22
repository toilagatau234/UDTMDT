import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, Select, InputNumber, Row, Tooltip } from "antd";
import React from "react";
const suffixColor = "#aaa";

const COLOR_TYPES = [
  { type: 0, label: "Đen" },
  { type: 1, label: "Bạc" },
  { type: 2, label: "Trắng" },
  { type: 3, label: "Hồng" },
  { type: 4, label: "Đỏ" },
  { type: 5, label: "Xám" },
  { type: 6, label: "Xanh" },
  { type: 7, label: "Vàng" },
  { type: 8, label: "Cam" },
];

function Speaker() {
  return (
    <Row gutter={[16, 16]}>
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
      {/* Công suất (W) */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="wattage"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={10}
            size="large"
            min={0}
            max={10000}
            placeholder="Công suất (W) *"
          />
        </Form.Item>
      </Col>
      {/* Lọai kết nối của loa */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeConnect"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Lọai kết nối *"
            suffix={
              <Tooltip title="loa không dây">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Cổng kết nối */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connectionPort"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Cổng kết nối *"
            suffix={
              <Tooltip title="3.5 mm">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  kiểu pin */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typePin"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Kiểu pin *"
            suffix={
              <Tooltip title="Pin Lithium">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Tần số phản hồi */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="fbfrequency"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Tần số phản hồi *"
            suffix={
              <Tooltip title="60Hz–20kHz">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/*  Tính năng khác */}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="otherFunc">
          <Input
            size="large"
            placeholder="Tính năng khác *"
            suffix={
              <Tooltip title="">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/*  kích thước */}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="size">
          <Input
            size="large"
            placeholder="Kích thước *"
            suffix={
              <Tooltip title="">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
export default Speaker;
