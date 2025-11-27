import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { OrderWrapper, OrderHeader } from './style'

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order detail:', error);
        toast.error('Không thể tải chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);


  if (loading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  const { shippingAddress: address } = order;

  return (
    <OrderWrapper>
      <OrderHeader>
        <div>
          <h2>Order Detail</h2>
        </div>
        <div>
          <Link to="/orders" className="btn btn-secondary">Back to Orders</Link>
        </div>
      </OrderHeader>

      <div className="row">
        {/* Cột Chi tiết Đơn hàng */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Order Details (ID: {order._id})</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Variant (Color, Size)</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map(item => (
                      <tr key={item._id}>
                        <td>
                          <h2 className="table-avatar">
                            <a href="#" className="avatar avatar-sm me-2">
                              <img className="avatar-img rounded" src={item.image} alt="Product" />
                            </a>
                            {item.name}
                          </h2>
                        </td>
                        <td>{item.variant.color}, {item.variant.size}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Cột Thông tin Khách hàng & Thanh toán */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header"><h5 className="card-title">Customer & Shipping</h5></div>
            <div className="card-body">
              <p><strong>Customer:</strong> {address.fullname}</p>
              <p><strong>Phone:</strong> {address.phone}</p>
              <p><strong>Address:</strong> {`${address.street}, ${address.ward}, ${address.district}, ${address.province}`}</p>
              <hr />
              <p><strong>Note:</strong> {order.note || '(No note)'}</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header"><h5 className="card-title">Summary & Status</h5></div>
            <div className="card-body">
              <p><strong>Status:</strong> <span className={`badge bg-${order.status === 'Delivered' ? 'success' : 'primary'}`}>{order.status}</span></p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Paid:</strong> <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>{order.isPaid ? 'Yes' : 'No'}</span></p>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping Fee:</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="d-flex justify-content-between text-danger">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OrderWrapper>
  );
};

export default OrderDetailPage;