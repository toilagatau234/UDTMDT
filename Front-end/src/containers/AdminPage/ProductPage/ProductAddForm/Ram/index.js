import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
import React from "react";

import { InfoCircleOutlined } from "@ant-design/icons";

const suffixColor = "#aaa";

const BUS_TYPES = [
  { type: 1600, label: "1600MHz" },
  { type: 2400, label: "2400MHz" },
  { type: 2666, label: "2666MHz" },
  { type: 3000, label: "3000MHz" },
  { type: 3200, label: "3200MHz" },
  { type: 3333, label: "3333MHz" },
  { type: 3600, label: "3600MHz" },
];

const RAM_TYPES = [
  { type: 0, label: "DDR3" },
  { type: 1, label: "DDR3L" },
  { type: 2, label: "DDR4" },
  { type: 3, label: "DDR5" },

];

function Ram() {
  return (
    <Row gutter={[16, 16]}>
      {/* Dung lượng (GB) */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="capacity"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Dung lượng (GB) *"
            suffix={
              <Tooltip title="1 x 32GB">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Thế hệ RAM */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Thế hệ RAM *">
            {RAM_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Loại bus */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="bus" rules={[{ required: true, message: "Bắt buộc" }]}>
          <Select size="large" placeholder="Loại bus (MHz) *">
            {BUS_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*Thời gian */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="timing"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={2}
            size="large"
            min={0}
            max={30}
            placeholder="Thời gian *"
          />
        </Form.Item>
      </Col>
      {/* Dung lượng (GB) */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="voltage"
        >
          <Input
            size="large"
            placeholder="Voltage *"
            suffix={
              <Tooltip title="1.2V">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Ram;
