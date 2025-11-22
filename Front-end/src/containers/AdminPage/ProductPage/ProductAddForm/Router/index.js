import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
import React from "react";
const BANDWIDTHS = [
  { type: 0, label: "2.4 GHz" },
  { type: 1, label: "2.4 GHz/ 5GHz" },
  { type: 2, label: "2.5 GHz/ 5GHz" },
];
const suffixColor = "#aaa";

function Router() {
  return (
    <Row gutter={[16, 16]}>
      {/* Băng thông */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="bandwidth"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Băng thông *">
            {BANDWIDTHS.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Độ mạnh ăng ten */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="strong"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={1}
            size="large"
            min={0}
            max={20}
            placeholder="Độ mạnh ăng ten *"
          />
        </Form.Item>
      </Col>
      {/* Chuẩn kết nối */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connectionStd"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Chuẩn kết nối *"
            suffix={
              <Tooltip title="802.11 b/g/n/ac">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  cổng kết nối */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="numberOfPort"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Các cổng kết nối *"
            suffix={
              <Tooltip title="1xWAN Gigabit">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Ăng tên */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="Antenna"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Các Ăng tên *"
            suffix={
              <Tooltip title="3x ngài">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Tốc độ */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="speed"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Tốc độ *"
            suffix={
              <Tooltip title="2.4GHz - 450Mbps">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>

      {/*  CPU/RAM/Flash */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="cpuRamFlash"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="CPU/RAM/Flash *"
            suffix={
              <Tooltip title="RAM 512MB / Flash 256MB">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Nguồn điện cấp */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="voltage"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Nguồn điện cấp *"
            suffix={
              <Tooltip title="12V DC / 1.5A">
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
      {/*  Phụ kiện đi kèm */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="accessories">
          <Input
            size="large"
            placeholder="Phụ kiện đi kèm *"
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

export default Router;
