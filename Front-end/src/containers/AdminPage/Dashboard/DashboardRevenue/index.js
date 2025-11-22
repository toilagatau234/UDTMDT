import { Col, Row } from "antd";
import React from "react";
import AnnualRevenue from "./AnnualRevenue";
import MonthlyRevenue from "./MonthlyRevenue";

function DashboardRevenue() {
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
    </Row>
  );
}

export default DashboardRevenue;
