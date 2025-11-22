import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Tooltip } from "antd";
import React from "react";
const suffixColor = "#aaa";

function Laptop() {
  return (
    <Row gutter={[16, 16]}>
      {/* Màu sắc*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="color"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Màu sắc *"
            suffix={
              <Tooltip title="Đen">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*thương hiệu chip*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="generationCpu"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Thế hệ Cpu *"
            suffix={
              <Tooltip title=" Core i7 , Intel Core thế hệ thứ 11">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* chi tiết chip cpu */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="detailCpu"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Chi tiết của cpu *"
            suffix={
              <Tooltip title="9750H up to 4.5 GHz">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* kích thước màn hình */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="displaySize"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Màn hình *"
            suffix={
              <Tooltip title={`15.6" (1920 x 1080), 60Hz`}>
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Card màn hình */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="display"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Card màn hình *"
            suffix={
              <Tooltip title="NVIDIA GeForce RTX 2080 Super 8GB GDDR6">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>

      {/* Ổ cứng */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="disk"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Ổ cứng *"
            suffix={
              <Tooltip title="1TB SSD M.2 NVMe">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* RAM */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="ram"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="RAM *"
            suffix={
              <Tooltip title="2 x 16GB DDR4 2933MHz">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* kiểu khe M.2 hỗ trợ  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeM2Sub"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Kiểu khe M.2 hỗ trợ *"
            suffix={
              <Tooltip title="M.2 SATA/NVMe">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Cổng xuất hình */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="outputPort"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Cổng xuất hình *"
            suffix={
              <Tooltip title="1 x HDMI">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Cổng kết nối */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connectionPort"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Cổng kết nối *"
            suffix={
              <Tooltip title="1 x USB Type C">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*  Kết nối không dây */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="connectWireless"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Kết nối không dây *"
            suffix={
              <Tooltip title="WiFi 802.11ac , Bluetooth 4.2">
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
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Hệ điều hành *"
            suffix={
              <Tooltip title="Windows 10 Pro 64-bit">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Bàn phím */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="keyborad"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Bàn phím *"
            suffix={
              <Tooltip title="thường , không phím số , LED">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Pin */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="pin"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Dung lượng pin *"
            suffix={
              <Tooltip title="4 cell 84 Wh Pin liền">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* kích thước  */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="size"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Kích thước *"
            suffix={
              <Tooltip title="39.4 x 26.4 x 1.99 cm">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Khối lượng */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="weight"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            step={1}
            size="large"
            min={0}
            max={10}
            placeholder="Khối lượng *"
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default Laptop;
