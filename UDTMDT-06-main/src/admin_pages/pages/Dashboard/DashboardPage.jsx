import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import {
  DashboardWrapper,
  DashboardCards,
  Card,
  ChartSection,
  WelcomeCard,
  StatCard,
  ChartCard,
  OrdersTable,
  TableResponsive
} from './style';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Gọi đồng thời các API
        const [statsRes, ordersRes, chartRes] = await Promise.all([
          apiService.get('/statistical/all'),
          apiService.get('/orders?status=Pending&limit=5'), // Giả sử API hỗ trợ limit
          apiService.get('/statistical/revenue-chart')
        ]);

        // Set Stats
        setStats(statsRes.data);

        // Set Pending Orders
        setPendingOrders(ordersRes.data.orders || ordersRes.data || []);

        // Set Chart Data
        // Chuyển đổi dữ liệu cho recharts
        const chartData = chartRes.data.map(item => ({
          name: `Tháng ${item.month}`,
          DoanhThu: item.totalRevenue, // Tên key này phải khớp với <Bar dataKey="..."/>
        }));
        setRevenueData(chartData);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Không thể tải dữ liệu dashboard. API có thể chưa sẵn sàng.');
        // Đặt giá trị mặc định để component không bị crash
        setStats({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 });
        setPendingOrders([]);
        setRevenueData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper>
      <DashboardCards>
        <WelcomeCard>
          <h3>Welcome Admin!</h3>
          <p>Dashboard</p>
        </WelcomeCard>

        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12">
            <StatCard>
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-primary">
                  <i className="fas fa-shipping-fast"></i>
                </span>
                <div className="dash-count">
                  <h3>{stats?.totalOrders || 0}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Total Orders</h6>
              </div>
            </StatCard>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <StatCard>
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-success">
                  <i className="fas fa-dollar-sign"></i>
                </span>
                <div className="dash-count">
                  <h3>{formatCurrency(stats?.totalRevenue)}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Total Revenue</h6>
              </div>
            </StatCard>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <StatCard>
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-danger">
                  <i className="fas fa-box"></i>
                </span>
                <div className="dash-count">
                  <h3>{stats?.totalProducts || 0}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Total Products</h6>
              </div>
            </StatCard>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <StatCard>
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-warning">
                  <i className="fas fa-users"></i>
                </span>
                <div className="dash-count">
                  <h3>{stats?.totalUsers || 0}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Total Users</h6>
              </div>
            </StatCard>
          </div>
        </div>
      </DashboardCards>

      <ChartSection>
        <ChartCard>
          <div className="card-header">
            <h4>Revenue</h4>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="DoanhThu" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <OrdersTable>
          <div className="card-header">
            <h4>Pending Orders</h4>
          </div>
          <div className="card-body">
            <TableResponsive>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.length > 0 ? (
                    pendingOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <h2 className="table-avatar">
                            {order.shippingAddress?.fullname || 'N/A'}
                          </h2>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                        <td>
                          <Link to={`/order/detail/${order._id}`} className="btn-primary">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>No pending orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TableResponsive>
          </div>
        </OrdersTable>
      </ChartSection>
    </DashboardWrapper>
  );
};

export default DashboardPage;