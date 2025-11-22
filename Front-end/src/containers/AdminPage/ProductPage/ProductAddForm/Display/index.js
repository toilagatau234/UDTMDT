import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
const suffixColor = "#aaa";

const MANUFACTURERS = [
  { type: 0, label: "NVIDIA" },
  { type: 1, label: "AMD" },
];

const PCITYPE = [
  { type: 0, label: "PCI Express 3.0" },
  { type: 1, label: "PCI Express 4.0" },
];

const VRTYPE = [
  { type: 0, label: "Hổ trợ" },
  { type: 1, label: "Không hổ trợ" },
];

function Display() {
  return (
    <Row gutter={[16, 16]}>
      {/*dung lượng*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="capacity"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={2}
            size="large"
            min={0}
            max={64}
            placeholder="Dung lượng (GB) *"
          />
        </Form.Item>
      </Col>
      {/* nhà sản xuất chipset*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="manufacturer"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Nhà sản xuất chipset *">
            {MANUFACTURERS.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*  GPU  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="gpu" rules={[{ required: true, message: "Bắt buộc" }]}>
          <Input
            size="large"
            placeholder="GPU *"
            suffix={
              <Tooltip title="GPU">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  GPU  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="gpuLock"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Gpu Lock *"
            suffix={
              <Tooltip title="Gpu Lock">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*   Bộ nhớ  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="memory"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Bộ nhớ *"
            suffix={
              <Tooltip title="6GB GDDR6">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Giao tiếp PCI*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="pci" rules={[{ required: true, message: "Bắt buộc" }]}>
          <Select size="large" placeholder=" Giao tiếp PCI *">
            {PCITYPE.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*Số lượng đơn vị xử lý*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="processor"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={128}
            size="large"
            min={0}
            max={10000}
            placeholder="Đơn vị xử lý (CUDA) *"
          />
        </Form.Item>
      </Col>
      {/*   Cổng kết nối  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connector"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Cổng kết nối *"
            suffix={
              <Tooltip title="1 x HDMI 2.0b">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*Số lượng Tản nhiệt*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="radiators"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={1}
            size="large"
            min={0}
            max={10}
            placeholder="Tản nhiệt *"
          />
        </Form.Item>
      </Col>
      {/*   Đèn Led  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="isLed">
          <Input
            size="large"
            placeholder="Đèn Led *"
            suffix={
              <Tooltip title="RGB">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*   Nguồn đề xuất */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="suggestVoltage">
          <Input
            size="large"
            placeholder="Nguồn đề xuất *"
            suffix={
              <Tooltip title="300W">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* VR*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="vr">
          <Select size="large" placeholder=" VR *">
            {VRTYPE.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*   Kích thước */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="size">
          <Input
            size="large"
            placeholder="Kích thước *"
            suffix={
              <Tooltip title="20.4 x 12.8 x 4.2 cm">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Display;
