import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, InputNumber, Row, Select, Tooltip } from "antd";
const suffixColor = "#aaa";

const SOCKET_TYPES = [
  { type: 0, label: "1151-v2" },
  { type: 1, label: "1200" },
  { type: 2, label: "AM4" },
  { type: 3, label: "1151" },
  { type: 4, label: "sTRX" },
];
const SIZE_STD = [
  { type: 0, label: "Micro-ATX" },
  { type: 1, label: "ATX" },
  { type: 2, label: "Extended-ATX" },
  { type: 3, label: "Mini-ATX" },
  { type: 4, label: "XL-ATX" },
];
const TYPERAMSUB_TYPES = [
  { type: 0, label: "DDR3" },
  { type: 1, label: "DDR4" },
  { type: 2, label: "DDR5" },
];
const TYPEM2SUB_TYPES = [
  { type: 0, label: "M.2 NVMe" },
  { type: 1, label: "M.2 SATA/NVMe" },
]

function MainBoard() {
  return (
    <Row gutter={[16, 16]}>
      {/* Chip set */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="chipset"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Chip set *"
            suffix={
              <Tooltip title="Z490">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Series */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="series"
          rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
        >
          <Input
            size="large"
            placeholder="Series *"
            suffix={
              <Tooltip title="KHT">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/* Loại socket */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="socketType"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Loại socket *">
            {SOCKET_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Chuẩn kích thước */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="sizeStd"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Chuẩn kích thước *">
            {SIZE_STD.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/* Khe RAM tối đa */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="maxRam"
          rules={[{ required: true, message: 'Bắt buộc' }]}>
          <InputNumber
            style={{ width: '100%' }}
            step={1}
            size="large"
            min={0}
            max={10}
            placeholder="Khe RAM tối đa *"
          />
        </Form.Item>
      </Col>
      {/* Kiểu RAM hỗ trợ */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeRamsub"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Kiểu RAM hỗ trợ *">
            {TYPERAMSUB_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*  Hỗ trợ bộ nhớ tối đa */}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="maxMenmorySub"
          rules={[{ required: true, message: 'Bắt buộc' }]}>
          <InputNumber
            style={{ width: '100%' }}
            step={32}
            size="large"
            min={0}
            max={1024}
            placeholder=" Hỗ trợ bộ nhớ tối đa *"
          />
        </Form.Item>
      </Col>
      {/*Bus RAM hỗ trợ*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="busRamSub"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
          <Input
            size="large"
            placeholder="Bus RAM hỗ trợ *"
            suffix={
              <Tooltip title="2666MHz">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
      {/*Lưu trữ*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="storage"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
          <Input
            size="large"
            placeholder="Lưu trữ *"
            suffix={
              <Tooltip title="4 x SATA 3 6Gb/s">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/* Kiểu RAM hỗ trợ */}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="typeM2Sub"
          rules={[{ required: true, message: "Bắt buộc" }]}
        >
          <Select size="large" placeholder="Kiểu khe M.2 hỗ trợ: *">
            {TYPEM2SUB_TYPES.map((item, index) => (
              <Select.Option value={item.type} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {/*Cổng xuất hình*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="outputPort"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
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
      {/*Khe PCI*/}
      <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="slotPCI"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
          <Input
            size="large"
            placeholder="Khe PCI *"
            suffix={
              <Tooltip title="1 x PCIe x16">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/*Multi-GPU*/}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="multiGpu"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
          <Input
            size="large"
            placeholder="Multi-GPU *"
            suffix={
              <Tooltip title="AMD CrossFire">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/*Đèn LED*/}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="ledColor"
        >
          <Input
            size="large"
            placeholder="Đèn LED *"
            suffix={
              <Tooltip title="RGB">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/*Số cổng USB*/}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="protUsb"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
          <Input
            size="large"
            placeholder="Số cổng USB *"
            suffix={
              <Tooltip title="1 x USB Type-C (tối đa 2)">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/*Lan*/}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="lan"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
          <Input
            size="large"
            placeholder="Lan *"
            suffix={
              <Tooltip title="1 x LAN 2.5Gb/s">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
       {/*Âm thanh*/}
       <Col span={12} md={8} xl={6} xxl={4}>
        <Form.Item
          name="Sound"
          rules={[{ required: true, message: 'Bắt buộc'}]}>
          <Input
            size="large"
            placeholder="Âm thanh *"
            suffix={
              <Tooltip title="Realtek® Audio codec">
                <InfoCircleOutlined style={{ color: suffixColor }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default MainBoard;
