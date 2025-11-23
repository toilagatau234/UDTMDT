import { BarChartOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import statisticApi from 'apis/statisticApi';
import helpers from 'helpers';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// tạo danh sách tháng
const generateLabels = () => {
  let results = [];
  for (let i = 0; i < 12; ++i) {
    results.push(`T${i + 1}`);
  }
  return results;
};

function MonthlyRevenue() {
  // Năm hiên tại
  const year = new Date().getFullYear();
  const [data, setData] = useState({ thisYear: [], lastYear: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Lây doanh thu
  useEffect(() => {
    let isSubScribe = true;
    const getStaMonthlyRevenue = async (year) => {
      try {
        setIsLoading(true);
        // const response = await statisticApi.getStaMonthlyRevenue(year);
        const response = await statisticApi.getStaMonthlyRevenue2(year);
        if (isSubScribe && response) {
          const { thisYear, lastYear } = response.data;
          setData({ thisYear, lastYear });
          setIsLoading(false);
        }
      } catch (error) {
        setData({ thisYear: [], lastYear: [] });
        if (isSubScribe) setIsLoading(false);
      }
    };

    getStaMonthlyRevenue(year);
    return () => {
      isSubScribe = false;
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Spin
          tip="Đang thống kê ..."
          size="large"
          indicator={<BarChartOutlined spin />}
        />
      ) : (
        <Bar
          data={{
            labels: generateLabels(),
            datasets: [
              {
                backgroundColor: "#2EA62A",
                data: [...data.lastYear],
                label: `Năm ${year - 1}`,
              },
              {
                backgroundColor: "#4670FF",
                data: [...data.thisYear],
                label: `Năm ${year}`,
              },
            ],
          }}
          options={{
            legend: { display: true },
            title: {
              display: true,
              text: `Doanh thu theo từng tháng của năm ${year - 1}, ${year}`,
              fontSize: 18,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    callback: function (value, index, values) {
                      return value >= 1000000000
                        ? `${(value / 1000000000).toFixed(1)} tỷ`
                        : value >= 1000000
                        ? `${(value / 1000000).toFixed(0)} tr`
                        : helpers.formatProductPrice(value);
                    },
                  },
                },
              ],
            },
          }}
        />
      )}
    </>
  );
}

export default MonthlyRevenue;
