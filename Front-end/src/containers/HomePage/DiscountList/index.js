import { Col, Row } from 'antd';
import Countdown from 'components/Countdown';
import RelatedProduct from 'containers/ProductDetailPage/RelatedProduct';
import React, { useState } from 'react';
import './index.scss';

// chuyển thời gian thành chuỗi + số ngày quy định
// để làm deadline (nDate là số ngày)
function convertTime(nDate) {
  const milisec = nDate * 24 * 60 * 60 * 1000;
  const time = new Date(Date.now() + milisec);
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const y = time.getFullYear();
  const h = time.getHours() % 12;
  return `${m} ${d} ${y}, ${h}:00 am`;
}

const list = [
  {
    title: "Laptop",
    type: 0,
    content: "Giảm trực tiếp 1.5tr",
    deadline: convertTime(3),
  },
  {
    title: "Màn Hình",
    type: 9,
    content: "Giảm 150.000đ",
    deadline: convertTime(4),
  },
  {
    title: "Phụ kiện",
    type: 10,
    content: "Giảm đến 24%",
    deadline: convertTime(5),
  },
  {
    title: "Bàn phím",
    type: 8,
    content: "Giảm đến 49%",
    deadline: convertTime(6),
  },
  {
    title: "Loa, âm thanh",
    type: 12,
    content: "Giảm đến 49%",
    deadline: convertTime(7),
  },
];

function DiscountList() {
  const [indexHeader, setIndexHeader] = useState(0);
  return (
    <div
      className={`Discount-List d-flex flex-direction-column bg-${indexHeader}`}
    >
      {/* menu header */}
      <div className="header d-flex justify-content-between ">
        {list.map((item, index) => {
          return (
            <div
              className={
                index !== indexHeader
                  ? `header-item w-100 d-flex flex-direction-column align-items-center font-weight-500 bg-white`
                  : `header-item w-100 d-flex flex-direction-column align-items-center font-weight-500 bg-white` +
                    "active"
              }
              key={index}
              onClick={() => {
                setIndexHeader(index);
              }}
            >
              <h2>{item.title}</h2>
              <span>{item.content}</span>
            </div>
          );
        })}
      </div>

      {/* content & product list */}
      <Row className="flex-grow-1">
        {/* countdown */}
        <Col
          span={24}
          md={6}
          className="d-flex flex-direction-column justify-content-center countdown"
        >
          <Countdown
            timeTillDate={list[indexHeader].deadline}
            timeFormat="MM DD YYYY, h:mm a"
          />
        </Col>
        {/* product list */}
        <Col span={24} md={18}>
          <RelatedProduct
            type={list[indexHeader].type}
            span={{ span: 24, xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default DiscountList;
