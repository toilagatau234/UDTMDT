import { Col, Modal, Row, Spin, Table, Tooltip } from 'antd';
import orderApi from 'apis/orderApi';
import helpers from 'helpers';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrderDetail(props) {
  const { orderId, onClose } = props;
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // : lấy chi tiết đơn hàng
  useEffect(() => {
    let isSubscribe = true;
    const getOrderDetails = async () => {
      try {
        const response = await orderApi.getOrderDetails3(orderId);
        if (response && isSubscribe) {
          setOrder(response.data.order);
          setIsLoading(false);
        }
      } catch (error) {
        setOrder(null);
        setIsLoading(false);
      }
    };

    getOrderDetails();
    return () => {
      isSubscribe = false;
    };
  }, [orderId]);

  // cột cho bảng chi tiết sản phẩm
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "prod",
      key: "prod",
      render: (v, record) => (
        record.orderDetails.map((item, index) => (
          <div className="m-b-12"  key={index}>
            <Link to={`/product/${item.orderProd.id}`} >
              <Tooltip title={item.orderProd.name}>
                {helpers.reduceProductName(item.orderProd.name, 40)}
              </Tooltip>
            </Link>
          </div>
          // <Link to={`/product/${record.orderProd.id}`}>
          //   <Tooltip title={record.orderProd.name}>
          //     {helpers.reduceProductName(record.orderProd.name, 40)}
          //   </Tooltip>
          // </Link>
        ))
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "prod",
      render: (v, record) => (
        record.orderDetails.map((item, index) => (
          <div className="m-b-12" key={index}>
            {helpers.formatProductPrice(item.orderProd.price)}
          </div>
        ))
        // {helpers.formatProductPrice(item.orderProd.price)}
      )
    },
    {
      title: "Số lượng",
      dataIndex: "numOfProd",
      key: "numOfProd",
      render: (v, record) => (
        record.orderDetails.map((item, index) => (
         <div className="m-b-12" key={index}>
            {item.numOfProd}
         </div>
        ))
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "prod",
      render: (v, record) => (
        record.orderDetails.map((item, index) => (
         <div className="m-b-12" key={index}>
            {`${item.orderProd.discount} %`}
         </div>
        ))
        //{`${item.orderProd.discount} %`}
      ),
    },
    {
      title: "Tạm tính",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (v, record) => {
        return record.orderDetails.map((item, index) => {
          const { price, discount } = item.orderProd;
          return (
            <div className="m-b-12" key={index}>
              {helpers.formatProductPrice(price * item.numOfProd - (price * item.numOfProd * discount) / 100)}
            </div>
          )
        })
        // const { price, discount } = record.orderDetails.orderProd;
        // return helpers.formatProductPrice(
        //   price * record.numOfProd - (price * record.numOfProd * discount) / 100
        // );
      },
    },
  ];

  return (
    <Modal
      width={1000}
      centered
      visible={visible}
      onCancel={() => {
        setVisible(false);
        onClose();
      }}
      maskClosable={false}
      footer={null}
      title={
        <p className="font-size-18px m-b-0">
          Chi tiết đơn hàng
          {order && (
            <>
              <span style={{ color: "#4670FF" }}>{` #${order.orderCode}`}</span>
              <b>{` - ${helpers.convertOrderStatus(order.orderStatus)}`}</b>
            </>
          )}
        </p>
      }
    >
      <>
        {isLoading ? (
          <div className="position-relative" style={{ minHeight: 100 }}>
            <Spin
              className="transform-center"
              tip="Đang tải chi tiết đơn hàng..."
              size="large"
            />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {/* thời gian đặt hàng */}
            <Col span={24} className="t-right">
              <b className="font-size-14px">
                {`Ngày đặt sản phẩm ${helpers.formatOrderDate(
                  order.orderDate,
                  1
                )}`}
              </b>
            </Col>

            {/* địa chỉ người nhận */}
            <Col span={12}>
              <h3 className="t-center m-b-12">Địa chỉ người nhận</h3>
              <div
                className="bg-gray p-tb-12 p-lr-16 bor-rad-8"
                style={{ minHeight: 150 }}
              >
                <h3 className="m-b-8">
                  <b>{order.deliveryAdd.name.toUpperCase()}</b>
                </h3>
                <p className="m-b-8">{`Địa chỉ: ${order.deliveryAdd.address}`}</p>
                <p className="m-b-8">
                  Số điện thoại: {order.deliveryAdd.phone}
                </p>
              </div>
            </Col>

            {/* Hình thức thanh toán */}
            <Col span={12}>
              <h3 className="t-center m-b-12">Hình thức thanh toán</h3>
              <div
                className="bg-gray p-tb-12 p-lr-16 bor-rad-8"
                style={{ minHeight: 150 }}
              >
                <p className="m-b-8">
                  {helpers.convertPaymentMethod(order.paymentMethod)}
                </p>
              </div>
            </Col>

            {/* Chi tiết sản phẩm đã mua */}
            <Col span={24}>
              <Table
                pagination={false}
                columns={columns}
                dataSource={[{ key: 1, ...order }]}
              />
            </Col>

            {/* Tổng cộng */}
            <Col span={24} className="t-right">
              <div className="d-flex font-weight-500 justify-content-end">
                <p style={{ color: "#bbb" }}>Tạm tính</p>
                <span
                  className="m-l-32"
                  style={{ color: "#888", minWidth: 180 }}
                >
                  {helpers.formatProductPrice(
                    order.orderDetails.reduce((total, item) => {
                      return  total +=
                        item.orderProd.price * item.numOfProd -
                        (item.orderProd.price * item.numOfProd *item.orderProd.discount) /100
                    }, 0)
                    // order.orderDetails.reduce((item, idx) => (
                    //   item.orderProd.price * item.numOfProd -
                    //     (item.orderProd.price *
                    //       item.numOfProd *
                    //       item.orderProd.discount) /
                    //       100
                    // ))
                  )}
                </span>
              </div>
              <div className="d-flex font-weight-500 justify-content-end">
                <p style={{ color: "#bbb" }}>Phí vận chuyển</p>
                <span
                  className="m-l-32"
                  style={{ color: "#888", minWidth: 180 }}
                >
                  {helpers.formatProductPrice(order.transportFee)}
                </span>
              </div>
              <div className="d-flex font-weight-500 justify-content-end">
                <p style={{ color: "#bbb" }}>Tổng cộng</p>
                <span
                  className="m-l-32 font-size-18px"
                  style={{ color: "#ff2000", minWidth: 180 }}
                >
                  {helpers.formatProductPrice(helpers.calTotalOrderFee2(order))}
                </span>
              </div>
            </Col>
          </Row>
        )}
      </>
    </Modal>
  );
}

export default OrderDetail;
