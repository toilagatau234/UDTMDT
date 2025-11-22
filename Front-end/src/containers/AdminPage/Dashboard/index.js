import { Col, Row } from "antd";
import React from "react";
import AnnualRevenue from "./DashboardRevenue/AnnualRevenue";
import MonthlyRevenue from "./DashboardRevenue/MonthlyRevenue";
import TopProductOrders from "./DashboardOrders/TopProductOrders";
import TopProvinceOrders from "./DashboardOrders/TopProvinceOrders";

function Dashboard() {
  return (
    <Row gutter={[32, 32]} className=" ">
      {/* doanh thu theo tháng */}
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <b className="font-size-16px">Danh thu theo tháng</b>
          <MonthlyRevenue />
        </div>
      </Col>
      {/* Doanh thu theo năm */}
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <b className="font-size-16px">Danh thu theo năm</b>
          <AnnualRevenue />
        </div>
      </Col>
      {/* Đơn hàng ở tỉnh nào nhiều nhất */}
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <b className="font-size-16px">Tỉnh có lượng đơn hàng cao</b>
          <TopProvinceOrders />
        </div>
      </Col>
      <Col span={24} xl={12}>
        <div className="bg-white p-12 bor-rad-8 box-sha-home">
          <b className="font-size-16px">Sản phẩm có đơn hàng cao</b>
          <TopProductOrders />
        </div>
      </Col>
    </Row>
  );
}

export default Dashboard;
