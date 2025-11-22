import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Tooltip } from "antd";
import React from "react";
const suffixColor = "#aaa";

function BackupCharger() {
  return (
    <Row gutter={[16, 16]}>
      {/* Dung lượng pin */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="capacityPin"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={2000}
            size="large"
            min={0}
            max={100000}
            placeholder="Dung lượng (mAh) *"
          />
        </Form.Item>
      </Col>
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
              <Tooltip title="Đỏ">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Lõi pin */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="corePin"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Lõi pin *"
            suffix={
              <Tooltip title="Lithium Polymer">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Số cổng sạc */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="numberOfPort"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={1}
            size="large"
            min={1}
            max={8}
            placeholder="Số cổng sạc *"
          />
        </Form.Item>
      </Col>

      {/* Mức điện áp vao*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="voltageIn"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Mức điện áp vào*"
            suffix={
              <Tooltip title="5V/1A">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Mức điện áp ra*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="voltageOut"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Mức điện áp ra*"
            suffix={
              <Tooltip title="5V/1A, 2A">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Khối lương (g) */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="weightG"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={100}
            size="large"
            min={0}
            max={10000}
            placeholder="Khối lương (g) *"
          />
        </Form.Item>
      </Col>
      {/* Kích thước*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="size"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Kích thước*"
            suffix={
              <Tooltip title="138 x 69 x 14 mm">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default BackupCharger;
