import { Spin } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import statisticApi from "apis/statisticApi";
import React, { useState, useEffect } from "react";

import { Doughnut } from "react-chartjs-2";

function TopProvinceOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState({ province: [], count: [] });

  // event: thống kê
  useEffect(() => {
    let isSubscribe = true;
    const getTopProvinceOrder = async () => {
      try {
        const response = await statisticApi.getTopProvinceOrder2();
        if (response && isSubscribe) {
          const { data } = response.data;
          setList({
            province: [...data.map((item) => item.province)],
            count: [...data.map((item) => item.count)],
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    };

    getTopProvinceOrder();
    return () => {
      isSubscribe = false;
    };
  }, []);
  return (
    <>
      {isLoading ? (
        <Spin
          tip="Đang thống kê ..."
          size="large"
          indicator={<PieChartOutlined spin />}
        />
      ) : (
        <Doughnut
          data={{
            labels: [...list.province],
            datasets: [
              {
                backgroundColor: [
                  "#3e95cd",
                  "#8e5ea2",
                  "#3cba9f",
                  "#e8c3b9",
                  "#c45850",
                ],
                data: [...list.count],
              },
            ],
          }}
          options={{
            legend: { display: true },
            title: {
              display: true,
              text: `Các tỉnh có đơn hàng nhiều nhất`,
              fontSize: 18,
            },
          }}
        />
      )}
    </>
  );
}

export default TopProvinceOrders;
