import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Radio, Button, Divider, message } from 'antd'
import { 
  EnvironmentOutlined, 
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined 
} from '@ant-design/icons'
import {
  WrapperContainer,
  WrapperLeft,
  WrapperRight,
  WrapperInfo,
  WrapperTotal,
  WrapperMethod,
  WrapperItemOrder
} from './style'
import { useNavigate, useLocation } from 'react-router-dom'

const PaymentPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [paymentMethod, setPaymentMethod] = useState('cod')

  // === DỮ LIỆU ĐỘNG TỪ GIỎ HÀNG ===
  const { items: orderItems, subtotal: itemsPrice, total: totalPrice } = location.state || {}
  const [shippingPrice, setShippingPrice] = useState(0)
  const [discountPrice, setDiscountPrice] = useState(0)

  useEffect(() => {
    // Nếu không có sản phẩm (vào thẳng /payment), quay về giỏ hàng
    if (!orderItems || orderItems.length === 0) {
        message.warning('Vui lòng chọn sản phẩm để thanh toán.', 3);
        navigate('/order');
    } else {
        // Tính toán lại dựa trên dữ liệu thật
        const calculatedShipping = itemsPrice >= 500000 ? 0 : 30000
        setShippingPrice(calculatedShipping)

        const calculatedDiscount = orderItems.reduce((total, item) => {
            const original = item.originalPrice || item.price;
            const final = item.price;
            if (original > final) {
                return total + ((original - final) * item.quantity)
            }
            return total
        }, 0)
        setDiscountPrice(calculatedDiscount)
    }
  }, [orderItems, itemsPrice, navigate])
  // === KẾT THÚC PHẦN DỮ LIỆU ĐỘNG ===


  const onFinish = (values) => {
    console.log('Order info:', {
      ...values,
      paymentMethod,
      orderItems,
      totalPrice
    })
    
    message.success('Đặt hàng thành công!')
    
    // TODO: Sau khi đặt hàng thành công, cần xóa các item này khỏi Redux
    
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  // Guard: Chờ redirect nếu không có data
  if (!orderItems || orderItems.length === 0) {
    return null; 
  }

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh', paddingBottom: '40px' }}>
      <WrapperContainer>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          Thanh toán
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            fullName: '',
            phone: '',
            address: '',
            city: 'Hồ Chí Minh',
            note: ''
          }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <WrapperLeft>
                {/* Thông tin giao hàng */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <EnvironmentOutlined style={{ color: '#326e51' }} />
                    Thông tin giao hàng
                  </h3>

                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                  >
                    <Input 
                      placeholder="Nhập họ và tên" 
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại!' },
                      { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                  >
                    <Input 
                      placeholder="Nhập số điện thoại" 
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                  >
                    <Input.TextArea 
                      placeholder="Nhập địa chỉ nhận hàng" 
                      rows={3}
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tỉnh/Thành phố"
                    name="city"
                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                  >
                    <Input 
                      placeholder="Nhập tỉnh/thành phố" 
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Ghi chú"
                    name="note"
                  >
                    <Input.TextArea 
                      placeholder="Ghi chú thêm (tùy chọn)" 
                      rows={2}
                      size="large"
                    />
                  </Form.Item>
                </div>

                {/* Phương thức thanh toán */}
                <div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CreditCardOutlined style={{ color: '#326e51' }} />
                    Phương thức thanh toán
                  </h3>

                  <Radio.Group 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <WrapperMethod>
                      <Radio value="cod">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                          <div>
                            <div style={{ fontWeight: '500' }}>Thanh toán khi nhận hàng (COD)</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              Thanh toán bằng tiền mặt khi nhận hàng
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </WrapperMethod>

                    <WrapperMethod>
                      <Radio value="banking">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <BankOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                          <div>
                            <div style={{ fontWeight: '500' }}>Chuyển khoản ngân hàng</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              Chuyển khoản qua Internet Banking
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </WrapperMethod>

                    <WrapperMethod>
                      <Radio value="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <CreditCardOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                          <div>
                            <div style={{ fontWeight: '500' }}>Thẻ tín dụng/Ghi nợ</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              Visa, Mastercard, JCB
                            </div>
                          </div>
                        </div>
                      </Radio>
                    </WrapperMethod>
                  </Radio.Group>

                  {paymentMethod === 'banking' && (
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#f5f5f5',
                      borderRadius: '8px'
                    }}>
                      <p style={{ fontWeight: '500', marginBottom: '8px' }}>Thông tin chuyển khoản:</p>
                      <p style={{ margin: '4px 0' }}>Ngân hàng: <strong>Vietcombank</strong></p>
                      <p style={{ margin: '4px 0' }}>Số tài khoản: <strong>1234567890</strong></p>
                      <p style={{ margin: '4px 0' }}>Chủ tài khoản: <strong>BEAUTYCOSMETIC</strong></p>
                      <p style={{ margin: '4px 0', color: '#ff424e' }}>
                        Nội dung: <strong>TEN SDT</strong>
                      </p>
                    </div>
                  )}
                </div>
              </WrapperLeft>
            </Col>

            <Col span={8}>
              <WrapperRight>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  Đơn hàng ({orderItems.length} sản phẩm)
                </h3>

                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                  {orderItems.map((item) => (
                    <WrapperItemOrder key={item.product}>
                      <img 
                        src={item.image} 
                        alt="product"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover', 
                          borderRadius: '4px' 
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          SL: {item.quantity}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#ff424e',
                        textAlign: 'right'
                      }}>
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </WrapperItemOrder>
                  ))}
                </div>

                <Divider style={{ margin: '16px 0' }} />

                <WrapperInfo>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>Tạm tính</span>
                    <span>{itemsPrice.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '12px',
                    color: '#ff424e'
                  }}>
                    <span>Giảm giá</span>
                    <span>-{discountPrice.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>Phí vận chuyển</span>
                    <span>{shippingPrice === 0 ? 'Miễn phí' : `${shippingPrice.toLocaleString('vi-VN')}đ`}</span>
                  </div>
                </WrapperInfo>

                <WrapperTotal>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Tổng cộng</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff424e' }}>
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </WrapperTotal>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#326e51',
                    borderColor: '#326e51',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '20px'
                  }}
                >
                  Đặt hàng
                </Button>

                <div style={{ 
                  marginTop: '12px', 
                  fontSize: '12px', 
                  color: '#999', 
                  textAlign: 'center' 
                }}>
                  Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của BeautyCosmetic
                </div>
              </WrapperRight>
            </Col>
          </Row>
        </Form>
      </WrapperContainer>
    </div>
  )
}

export default PaymentPage