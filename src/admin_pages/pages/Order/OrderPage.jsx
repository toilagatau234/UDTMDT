import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import { OrderWrapper, OrderHeader, OrderFilters } from './style'

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Hàm gọi API
  const fetchOrders = useCallback(async (page, search = '', status = '') => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        search: search,
        status: status,
      };
      const response = await apiService.get('/orders', { params });
      
      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Không thể tải đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Lấy dữ liệu
  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
  }, [fetchOrders, currentPage, searchTerm, statusFilter]);

  // Xử lý Pagination và Search/Filter
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // --- Xử lý Actions ---
  
  // Cập nhật trạng thái
  const handleUpdateStatus = async (orderId, newStatus) => {
    const toastId = toast.loading('Đang cập nhật...');
    try {
      await apiService.put(`/orders/status/${orderId}`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công!', { id: toastId });
      
      // Cập nhật UI
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Cập nhật thất bại.', { id: toastId });
    }
  };


  return (
    <OrderWrapper>
      <OrderHeader>
        <div>
          <h2>Orders</h2>
        </div>
      </OrderHeader>

      {/* Thanh Search & Filter */}
      <OrderFilters>
        <div className="search-box">
          <input 
            type="text"
            className="form-control"
            placeholder="Tìm kiếm (Tên, SĐT khách hàng)..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-select">
          <select className="form-select" value={statusFilter} onChange={handleStatusChange}>
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </OrderFilters>

      {/* Bảng Order */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7" className="text-center"><div className="spinner-border text-primary"></div></td></tr>
                    ) : orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.shippingAddress?.fullname || 'N/A'}</td>
                          <td>{order.shippingAddress?.phone || 'N/A'}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>
                            <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                              {order.paymentMethod} {order.isPaid ? '(Paid)' : '(Not Paid)'}
                            </span>
                          </td>
                          <td>
                            {/* Dropdown cập nhật trạng thái */}
                            <select 
                              className={`form-select form-select-sm 
                                ${order.status === 'Delivered' ? 'border-success' : 
                                  order.status === 'Cancelled' ? 'border-danger' : 
                                  order.status === 'Pending' ? 'border-warning' : 'border-primary'}`}
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            >
                              {ORDER_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="text-end">
                            <Link to={`/order/detail/${order._id}`} className="btn btn-sm btn-info">
                              <i className="fas fa-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="text-center">No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Phân trang */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </OrderWrapper>
  );
};

export default OrderPage;