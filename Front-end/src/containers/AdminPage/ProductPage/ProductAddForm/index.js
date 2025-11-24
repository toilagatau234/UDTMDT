import React, { useEffect, useRef, useState } from "react";
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  Upload,
} from "antd";
import adminApi from "../../../../apis/adminApi";
import categoryApi from "../../../../apis/categoryApi"; // Đảm bảo đường dẫn import đúng
import constants from "../../../../constants";
import Compressor from "compressorjs";

// Import các component chi tiết sản phẩm
import Laptop from "./Laptop";
import Disk from "./Disk";
import ProductDetail from "./ProductDetailModal";
import Display from "./Display";
import MainBoard from "./MainBoard";
import Ram from "./Ram";
import Mobile from "./Mobile";
import BackupCharger from "./BackupCharger";
import Headphone from "./Headphone";
import Keyboard from "./Keyboard";
import Monitor from "./Monitor";
import Mouse from "./Mouse";
import Speaker from "./Speaker";
import Camera from "./Camera";
import Webcam from "./Webcam";
import Router from "./Router";
import Cpu from "./Cpu";

const suffixColor = "#aaa";

function AddProduct() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [typeSelected, setTypeSelected] = useState(-1);
  const [category, setCategory] = useState([]); // State lưu danh sách danh mục
  const productDecs = useRef(null);

  // State quản lý ảnh
  const [avtFileList, setAvtFileList] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [fileList, setFileList] = useState([]);
  const fileCompressedList = useRef([]);

  // === 1. SỬA LẠI LOGIC LẤY DANH MỤC ===
  useEffect(() => {
    let isSubscribe = true;
    const getCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        if (response && isSubscribe) {
          // SỬA LẠI: Backend trả về { data: [...] } nên cần truy cập response.data.data
          // Nếu response.data.data không tồn tại thì fallback về mảng rỗng
          const listCategory = response.data.data || [];
          setCategory(listCategory);
        }
      } catch (error) {
        // message.error("Lấy danh mục thất bại");
      }
    };

    getCategories();
    return () => (isSubscribe = false);
  }, []);

  // fn: xử lý khi chọn loại sản phẩm
  const onProductTypeChange = (value) => {
    if (!isTypeSelected) setIsTypeSelected(true);
    setTypeSelected(value);
  };

  // fn: Render ra component tương ứng khi chọn loại sp
  const onRenderProduct = (value) => {
    switch (value) {
      case 0: return <Laptop />;
      case 1: return <Disk />;
      case 2: return <Display />;
      case 3: return <MainBoard />;
      case 4: return <Ram />;
      case 5: return <Mobile />;
      case 6: return <BackupCharger />;
      case 7: return <Headphone />;
      case 8: return <Keyboard />;
      case 9: return <Monitor />;
      case 10: return <Mouse />;
      case 11: return <Router />;
      case 12: return <Speaker />;
      case 13: return <Camera />;
      case 14: return <Webcam />;
      case 15: return <Cpu />;
      default: return null;
    }
  };

  const onCompressFile = async (file, type = 0) => {
    new Compressor(file, {
      quality: 0.6,
      convertSize: 2000000,
      success(fileCompressed) {
        const reader = new FileReader();
        reader.readAsDataURL(fileCompressed);
        reader.onloadend = async () => {
          if (type === 0) setAvatar(reader.result);
          else if (fileCompressedList.current.length < 10)
            fileCompressedList.current.push({
              data: reader.result,
              uid: file.uid,
            });
        };
      },
      error(err) {
        message.error("Lỗi nén ảnh: " + err.message);
      },
    });
  };

  const onGetDetailDesc = (data) => {
    productDecs.current = data;
  };

  const onResetForm = () => {
    form.resetFields();
    fileCompressedList.current = [];
    setAvtFileList([]);
    setAvatar(null);
    setFileList([]);
  };

  const onValBeforeSubmit = async (data) => {
    try {
      if (!avatar) {
        message.error("Hãy thêm ảnh đại diện (Avatar) !", 2);
        return;
      }

      const confirmSubmit = (content) => {
        Modal.confirm({
          title: "Bạn có chắc muốn tạo sản phẩm này?",
          content: content,
          icon: <ExclamationCircleOutlined />,
          onOk() {
            onSubmit(data);
          },
        });
      };

      if (productDecs.current === null) {
        confirmSubmit("Cảnh báo: Chưa có BÀI VIẾT MÔ TẢ cho sản phẩm này!");
      } else if (fileCompressedList.current.length === 0) {
        confirmSubmit("Cảnh báo: Chưa có HÌNH ẢNH MÔ TẢ (Slide) cho sản phẩm này!");
      } else {
        onSubmit(data);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra.");
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const { category, code, name, price, discount, stock, brand, otherInfo, ...rest } = data;

      // Tạo object product
      const product = {
        type: typeSelected,
        category, // Dữ liệu category từ form (đã chọn ở Select)
        code,
        name,
        price,
        discount,
        stock,
        brand,
        otherInfo,
        avatar,
      };

      const catalogs = fileCompressedList.current.map((item) => item.data);
      const details = {
        ...rest,
        catalogs,
      };

      const dataSend = { product, details, desc: productDecs.current };
      const response = await adminApi.postAddProduct(dataSend);

      if (response.status === 200) {
        message.success("Thêm sản phẩm thành công");
        onResetForm(); // Reset form sau khi thành công
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Thêm sản phẩm thất bại.");
      }
    }
  };

  return (
    <div className="Admin-Product-Page">
      <h1 className="t-center p-t-20">
        <b>Thêm sản phẩm</b>
      </h1>

      <Select
        className="m-l-20"
        size="large"
        style={{ width: 250 }}
        onChange={onProductTypeChange}
        placeholder="Chọn loại sản phẩm *"
      >
        {constants.PRODUCT_TYPES.map((item, index) => (
          <Select.Option value={item.type} key={index}>
            {item.label}
          </Select.Option>
        ))}
      </Select>

      {isTypeSelected && (
        <div className="p-20">
          <Form
            name="form"
            form={form}
            onFinish={onValBeforeSubmit}
            onFinishFailed={() => message.error("Vui lòng điền đầy đủ thông tin bắt buộc!")}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <h2>Thông tin cơ bản sản phẩm</h2>
              </Col>

              {/* === 2. SỬA LẠI PHẦN CHỌN DANH MỤC === */}
              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="category"
                  rules={[{ required: false, message: "Bắt buộc chọn danh mục" }]}
                >
                  <Select allowClear size="large" placeholder="Danh mục *">
                    {/* Kiểm tra mảng category trước khi map */}
                    {Array.isArray(category) && category.map((item) => (
                      // Sử dụng item._id làm key thay vì index để tối ưu React
                      <Select.Option value={item.name} key={item._id || item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
                >
                  <Input
                    size="large"
                    placeholder="Mã sản phẩm *"
                    suffix={
                      <Tooltip title="Ví dụ: SKU200500854">
                        <InfoCircleOutlined style={{ color: suffixColor }} />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
                >
                  <Input
                    size="large"
                    placeholder="Tên sản phẩm *"
                  />
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={10000}
                    size="large"
                    placeholder="Giá *"
                    min={0}
                    max={1000000000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="stock"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={1}
                    size="large"
                    min={0}
                    placeholder="Số lượng tồn kho *"
                  />
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="brand"
                  rules={[{ required: true, message: "Bắt buộc", whitespace: true }]}
                >
                  <Input
                    size="large"
                    placeholder="Thương hiệu *"
                  />
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="warranty"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={6}
                    size="large"
                    min={0}
                    max={240}
                    placeholder="Bảo hành (tháng) *"
                  />
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.Item
                  name="discount"
                  initialValue={0}
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step={5}
                    size="large"
                    min={0}
                    max={100}
                    placeholder="Giảm giá (%) *"
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Form.Item>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Upload
                  listType="picture"
                  fileList={avtFileList}
                  onChange={({ fileList }) => {
                    // Chỉ giữ lại 1 file mới nhất
                    setAvtFileList(fileList.slice(-1));
                  }}
                  onRemove={() => {
                    setAvatar(null);
                    setAvtFileList([]);
                  }}
                  beforeUpload={(file) => {
                    onCompressFile(file, 0);
                    return false; // Prevent auto upload
                  }}
                  maxCount={1}
                >
                  <Button
                    disabled={avatar !== null}
                    className="w-100 h-100"
                    icon={<UploadOutlined />}
                  >
                    Upload Avatar (Ảnh đại diện)
                  </Button>
                </Upload>
              </Col>

              <Col span={12} md={8} xl={6} xxl={4}>
                <Form.List name="otherInfo">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <Space
                          key={field.key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, "key"]}
                            fieldKey={[field.fieldKey, "key"]}
                            rules={[{ required: true, message: "Nhập tên thông tin" }]}
                          >
                            <Input placeholder="Tên (vd: Ưu đãi)" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "value"]}
                            fieldKey={[field.fieldKey, "value"]}
                            rules={[{ required: true, message: "Nhập giá trị" }]}
                          >
                            <Input placeholder="Giá trị (vd: Tặng chuột)" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm thông tin khác
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>

              <ProductDetail onGetDetailDes={onGetDetailDesc} />

              {isTypeSelected && (
                <Col span={24}>
                  <h2 className="m-b-10">
                    Thông tin chi tiết: <b>{constants.PRODUCT_TYPES[typeSelected].label}</b>
                  </h2>
                  <div className="bg-white p-16 bor-rad-8">
                    {onRenderProduct(typeSelected)}
                  </div>
                </Col>
              )}

              <Col span={24}>
                <h2 className="m-b-10">
                  Hình ảnh Slide sản phẩm (Tối đa 10 ảnh)
                </h2>
                <Upload
                  listType="picture-card"
                  multiple={true}
                  fileList={fileList}
                  onRemove={(file) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    setFileList(newFileList);
                    // Xóa khỏi mảng nén
                    fileCompressedList.current = fileCompressedList.current.filter(
                      (item) => item.uid !== file.uid
                    );
                  }}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={(file) => {
                    onCompressFile(file, 1);
                    return false;
                  }}
                >
                  {fileList.length < 10 && "+ Thêm ảnh"}
                </Upload>
              </Col>

              <Col span={24} className="d-flex justify-content-end m-t-20">
                <Button
                  className="m-r-20"
                  size="large"
                  danger
                  onClick={onResetForm}
                >
                  Reset Form
                </Button>
                <Button
                  loading={isSubmitting}
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  Hoàn tất thêm sản phẩm
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </div>
  );
}

export default AddProduct;