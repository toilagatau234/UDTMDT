import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
import React from "react";

const suffixColor = "#aaa";
const BG_PLATES = [
  { type: 0, label: "IPS" },
  { type: 1, label: "VA" },
  { type: 2, label: "TN" },
  { type: 3, label: "PLS" },
  { type: 4, label: "MVA" },
  { type: 5, label: "KHT" },
];
const MONITOR_RESOLUTIONS = [
  { type: 0, label: "1920x1080" },
  { type: 1, label: "2560x1440" },
  { type: 2, label: "1920x1200" },
  { type: 3, label: "1366x768" },
  { type: 4, label: "1600x900" },
  { type: 5, label: "3840x2160" },
  { type: 6, label: "2560x1080" },
  { type: 7, label: "3440x1440" },
];
const TYPEMONITOR_TYPES=[
  { type: 0, label: "Màn hình phẳng" },
  { type: 1, label: "Màn hình cong" },
]

function Monitor() {
  return (
    <Row gutter={[16, 16]}>
      {/* Kích thước màn hình */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="displaySize"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            maxLength={5}
            size="large"
            placeholder="Kích thước màn hình *"
            suffix={
              <Tooltip title={`24.7"`}>
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
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Độ phân giải *">
            {MONITOR_RESOLUTIONS.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Tấm nền */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="bgPlate"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Tấm nền *">
            {BG_PLATES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Tần số quét */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="frequency"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={30}
            size="large"
            min={0}
            max={1000}
            placeholder="Tần số quét *"
          />
        </Form.Item>
      </Col>
       {/* Thời gian phản hồi */}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="timeResponse"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={1}
            size="large"
            min={0}
            max={10}
            placeholder="Thời gian phản hồi *"
          />
        </Form.Item>
      </Col>
      {/* Kiểu màn hình */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeMonitor"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Kiểu màn hình *">
            {TYPEMONITOR_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
       {/* Độ sáng */}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="Brightness"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={10}
            size="large"
            min={0}
            max={500}
            placeholder="Độ sáng *"
          />
        </Form.Item>
      </Col>
      {/* Khả năng hiển thị màu */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="colorVisibility"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Khả năng hiển thị màu *"
            suffix={
              <Tooltip title="16.7 triệu mầu">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Các cổng kết nối */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connectionPort"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Các cổng kết nối *"
            suffix={
              <Tooltip title="1 x HDMI, 1 x DVI-D, 1 x VGA/D-sub">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Monitor;
