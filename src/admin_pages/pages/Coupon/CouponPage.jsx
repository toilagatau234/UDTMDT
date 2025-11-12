import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Switch from 'react-switch';
import Modal from '../../components/Modal/Modal';
import Pagination from '../../components/Pagination/Pagination';
import { 
  CouponWrapper,
  CouponHeader,
  CouponFilters,
  CouponTable,
  TableResponsive,
  LoadingWrapper,
  NoDataMessage,
  ActionButtons
} from './style'

// Hàm định dạng ngày tháng (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Chuyển đổi sang múi giờ địa phương (Việt Nam) trước khi lấy giá trị
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60000));
    return localDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Invalid date string:', dateString);
    return '';
  }
};

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    quantity: '',
  });

  // Hàm gọi API
  const fetchCoupons = useCallback(async (page, search = '') => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        search: search,
      };
      const response = await apiService.get('/coupons', { params });
      
      setCoupons(response.data.coupons || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      toast.error('Không thể tải mã giảm giá.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Lấy dữ liệu
  useEffect(() => {
    fetchCoupons(currentPage, searchTerm);
  }, [fetchCoupons, currentPage, searchTerm]);

  // Xử lý Pagination và Search
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý thay đổi Form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // --- Xử lý Modal ---

  const resetForm = () => {
    setFormData({
      code: '',
      discount: '',
      expiryDate: '',
      quantity: '',
    });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentCoupon(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setIsEditMode(true);
    setCurrentCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      expiryDate: formatDateForInput(coupon.expiryDate),
      quantity: coupon.quantity,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  
  const onModalClose = () => {
    resetForm();
    setIsEditMode(false);
    setCurrentCoupon(null);
    setFormLoading(false);
  };

  // Xử lý Submit (Thêm/Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      ...formData,
      // Đảm bảo gửi đúng định dạng số
      discount: Number(formData.discount),
      quantity: Number(formData.quantity),
      // Đảm bảo gửi đúng định dạng ngày (API có thể chấp nhận YYYY-MM-DD)
      expiryDate: new Date(formData.expiryDate).toISOString(),
    };

    try {
      if (isEditMode && currentCoupon) {
        // Chế độ Sửa
        await apiService.put(`/coupons/${currentCoupon._id}`, payload);
        toast.success('Cập nhật coupon thành công!');
      } else {
        // Chế độ Thêm
        await apiService.post('/coupons', payload);
        toast.success('Thêm coupon thành công!');
      }
      
      closeModal();
      fetchCoupons(currentPage, searchTerm); // Tải lại

    } catch (error) {
      console.error('Failed to save coupon:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // --- Xử lý Actions ---

  // Toggle Status
  const handleToggleStatus = async (coupon) => {
    const newStatus = !coupon.status;
    const toastId = toast.loading('Đang cập nhật...');
    try {
      // API có thể yêu cầu endpoint riêng hoặc chỉ cần PUT
      // cần gửi đủ các trường dữ liệu nếu API không hỗ trợ PATCH
      const payload = {
        code: coupon.code,
        discount: coupon.discount,
        expiryDate: coupon.expiryDate,
        quantity: coupon.quantity,
        status: newStatus 
      };
      await apiService.put(`/coupons/${coupon._id}`, payload);
      toast.success('Cập nhật trạng thái thành công!', { id: toastId });
      
      setCoupons(coupons.map(c =>
        c._id === coupon._id ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Cập nhật thất bại.', { id: toastId });
    }
  };

  // Xử lý Xóa (Delete)
  const handleDelete = (coupon) => {
    toast((t) => (
      <span>
        Bạn có chắc muốn xóa <b>{coupon.code}</b>?
        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => {
            confirmDelete(coupon._id);
            toast.dismiss(t.id);
          }}
        >
          Xóa
        </button>
        <button
          className="btn btn-secondary btn-sm ms-1"
          onClick={() => toast.dismiss(t.id)}
        >
          Hủy
        </button>
      </span>
    ));
  };

  const confirmDelete = async (id) => {
    const toastId = toast.loading('Đang xóa...');
    try {
      await apiService.delete(`/coupons/${id}`);
      toast.success('Xóa coupon thành công!', { id: toastId });
      fetchCoupons(currentPage, searchTerm); // Tải lại
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      toast.error('Xóa thất bại.', { id: toastId });
    }
  };

  return (
    <CouponWrapper>
      <CouponHeader>
        <div className="header-row">
          <h2 className="page-title">Coupons</h2>
          <button className="btn-primary" onClick={openAddModal}><i className="fas fa-plus"></i> Add Coupon</button>
        </div>
      </CouponHeader>

      <CouponFilters>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm mã coupon..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </CouponFilters>

      <CouponTable>
        <TableResponsive>
          <table className="table table-hover table-center mb-0">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount (%)</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <LoadingWrapper>
                      <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
                    </LoadingWrapper>
                  </td>
                </tr>
              ) : coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td><b>{coupon.code}</b></td>
                    <td className="discount">{coupon.discount}%</td>
                    <td>{coupon.quantity}</td>
                    <td>{formatDateForInput(coupon.expiryDate)}</td>
                    <td className="status-cell">
                      <Switch
                        onChange={() => handleToggleStatus(coupon)}
                        checked={coupon.status}
                        onColor="#00D285"
                        onHandleColor="#ffffff"
                        handleDiameter={20}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={15}
                        width={35}
                      />
                    </td>
                    <td className="text-end">
                      <ActionButtons>
                        <button className="btn btn-warning" onClick={() => openEditModal(coupon)}><i className="fas fa-edit"></i></button>
                        <button className="btn btn-danger" onClick={() => handleDelete(coupon)}><i className="fas fa-trash"></i></button>
                      </ActionButtons>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <NoDataMessage>No coupons found.</NoDataMessage>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableResponsive>
      </CouponTable>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal Thêm/Sửa */}
      <Modal
        id="couponModal"
        title={isEditMode ? 'Edit Coupon' : 'Add New Coupon'}
        show={showModal}
        onClose={closeModal} // Yêu cầu đóng modal
        onModalClose={onModalClose} // Reset khi đã đóng
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={formLoading}
            >
              {formLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Save'}
            </button>
          </>
        }
        >
        <div className="modal-content-custom">
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Coupon Code</label>
            <input
              type="text"
              className="form-control"
              name="code"
              value={formData.code}
              onChange={handleFormChange}
              placeholder="Enter coupon code"
              required
            />
          </div>
          <div className="form-group">
            <label>Discount (%)</label>
            <input
              type="number"
              className="form-control"
              name="discount"
              value={formData.discount}
              onChange={handleFormChange}
              placeholder="Enter discount percentage"
              min="1"
              max="100"
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={formData.quantity}
              onChange={handleFormChange}
              placeholder="Enter quantity"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              className="form-control"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleFormChange}
              required
            />
          </div>
          </form>
        </div>
      </Modal>
    </CouponWrapper>
  );
};

export default CouponPage;