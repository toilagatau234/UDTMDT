import { Col, Form, Input, InputNumber, Row, Tooltip } from "antd";
import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
const suffixColor = "#aaa";

function Cpu() {
  return (
    <Row gutter={[16, 16]}>
      {/*  CPU  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="cpu" rules={[{ required: true, message: "Bắt buộc" }]}>
          <Input
            size="large"
            placeholder="CPU *"
            suffix={
              <Tooltip title="Pentium Gold G6405">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Series  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="series"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Series *"
            suffix={
              <Tooltip title="Pentium">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* loại socket */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="socketType"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Loại socket *"
            suffix={
              <Tooltip title="1200">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Sô nhân xử lý */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="multiplier"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            min={0}
            step={1}
            max={20}
            style={{ width: "100%" }}
            size="large"
            placeholder="Sô nhân xử lý *"
          />
        </Form.Item>
      </Col>
      {/* Số luồng xử lý */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="processingFlow"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            min={0}
            step={1}
            max={20}
            style={{ width: "100%" }}
            size="large"
            placeholder="Số luồng xử lý *"
          />
        </Form.Item>
      </Col>
      {/*   Thế hệ  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="generation"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Thế hệ *"
            suffix={
              <Tooltip title="Intel Pentium Gold">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*   Tốc độ xử lý  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="processingSpeed"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Tốc độ xử lý *"
            suffix={
              <Tooltip title="3.70 GHz - 4.80 GHz">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*   Cache  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="cache"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            min={0}
            step={12}
            max={1024}
            style={{ width: "100%" }}
            size="large"
            placeholder="Cache (MB) *"
          />
        </Form.Item>
      </Col>
      {/*   Chip đồ họa  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="graphicsChip">
          <Input
            size="large"
            placeholder="Chip đồ họa *"
            suffix={
              <Tooltip title="">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* TDP */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="tdp" rules={[{ required: true, message: "Bắt buộc" }]}>
          <InputNumber
            style={{ width: "100%" }}
            step={10}
            size="large"
            min={0}
            max={1000}
            placeholder="TDP (W) *"
          />
        </Form.Item>
      </Col>
      {/*   Hyper-Threading  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item name="hyperThreading">
          <Input
            size="large"
            placeholder="Hyper-Threading *"
            suffix={
              <Tooltip title="Có">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*   Bộ nhớ hỗ trợ  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="memorySub"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Input
            size="large"
            placeholder="Bộ nhớ hỗ trợ *"
            suffix={
              <Tooltip title="DDR4">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Cpu;
