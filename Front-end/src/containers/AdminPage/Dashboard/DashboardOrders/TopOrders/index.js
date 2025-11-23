import { PieChartOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import statisticApi from 'apis/statisticApi';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function TopProductOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState({ name: [], count: [] });

  // event: thống kê sản phẩm có nhiều đơn đặt hàng
  useEffect(() => {
    let isSubscribe = true;
    const getTopProvinceOrder = async () => {
      try {
        const response = await statisticApi.getTopProductOrder2();
        if (response && isSubscribe) {
          const { data } = response.data;
          setList({
            name: [...data.map((item) => helpers.reduceProductName(item.name, 30))],
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
            labels: [...list.name],
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
              text: `Sản phẩm có nhiều đơn hàng`,
              fontSize: 18,
            },
          }}
        />
      )}
    </>
  );
}

export default TopProductOrders;
