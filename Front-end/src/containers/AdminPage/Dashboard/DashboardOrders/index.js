import { Col, Row } from "antd";
import React from "react";
import TopProductOrders from "./TopOrders";
import TopProvinceOrders from "./TopProvinceOrders";

function DashboardOrders() {
  return (
    <Row gutter={[32, 32]} className=" ">
      
      {/* Đơn hàng ở tỉnh nào nhiều nhất */}
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <b className="font-size-16px">Tỉnh có lượng đơn hàng cao</b>
          <TopProvinceOrders />
        </div>
      </Col>
      {/* Sản phảm có số lượng bán cao */}
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <b className="font-size-16px">Sản phẩm có số lượng bán cao</b>
          <TopProductOrders />
        </div>
      </Col>
    </Row>
  );
}

export default DashboardOrders;
