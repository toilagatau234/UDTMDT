import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import defaultAvatar from '../../assets/img/avatar.jpg';
import { FeedbackWrapper, FeedbackHeader, FeedbackFilters, FeedbackGrid, FeedbackCard, ActionButtons } from './style'

// Component hiển thị sao
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i 
        key={i} 
        className={`fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}`}
      ></i>
    );
  }
  return <>{stars}</>;
};

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Hàm gọi API
  const fetchFeedbacks = useCallback(async (page) => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
      };
      const response = await apiService.get('/feedbacks', { params });
      
      setFeedbacks(response.data.feedbacks || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      toast.error('Không thể tải đánh giá.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Lấy dữ liệu
  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [fetchFeedbacks, currentPage]);

  // Xử lý Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // --- Xử lý Modal ---
  const openDetailModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  
  const onModalClose = () => {
    setSelectedFeedback(null);
  };

  // --- Xử lý Actions ---

  // Xử lý Xóa (Delete)
  const handleDelete = (feedback) => {
    toast((t) => (
      <span>
        Bạn có chắc muốn xóa đánh giá này?
        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => {
            confirmDelete(feedback._id);
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
      await apiService.delete(`/feedbacks/${id}`);
      toast.success('Xóa đánh giá thành công!', { id: toastId });
      fetchFeedbacks(currentPage); // Tải lại
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      toast.error('Xóa thất bại.', { id: toastId });
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="row align-items-center">
          <div className="col">
            <h3 className="page-title">Feedbacks</h3>
          </div>
        </div>
      </div>

      {/* Bảng Feedback */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Product</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : feedbacks.length > 0 ? (
                      feedbacks.map((fb) => (
                        <tr key={fb._id}>
                          <td>
                            <h2 className="table-avatar">
                              <a href="#" className="avatar avatar-sm me-2">
                                <img
                                  className="avatar-img rounded-circle"
                                  src={fb.user?.avatar || defaultAvatar}
                                  alt="User"
                                />
                              </a>
                              {fb.user?.fullname || 'N/A'}
                            </h2>
                          </td>
                          <td>{fb.product?.name || 'Sản phẩm đã bị xóa'}</td>
                          <td><StarRating rating={fb.rating} /></td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {fb.comment}
                          </td>
                          <td>{new Date(fb.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-info me-2"
                              onClick={() => openDetailModal(fb)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(fb)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No feedbacks found.</td>
                      </tr>
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

      {/* Modal Chi tiết */}
      <Modal
        id="feedbackModal"
        title="Feedback Detail"
        show={showModal}
        onClose={closeModal}
        onModalClose={onModalClose}
        footer={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeModal}
          >
            Close
          </button>
        }
      >
        {selectedFeedback && (
          <div>
            <p><strong>User:</strong> {selectedFeedback.user?.fullname}</p>
            <p><strong>Product:</strong> {selectedFeedback.product?.name}</p>
            <p><strong>Rating:</strong> <StarRating rating={selectedFeedback.rating} /></p>
            <p><strong>Date:</strong> {new Date(selectedFeedback.createdAt).toLocaleString('vi-VN')}</p>
            <hr />
            <p><strong>Comment:</strong></p>
            <p>{selectedFeedback.comment}</p>
            
            {selectedFeedback.images && selectedFeedback.images.length > 0 && (
              <>
                <p><strong>Images:</strong></p>
                <div className="row">
                  {selectedFeedback.images.map((img, index) => (
                    <div className="col-4" key={index}>
                      <img src={img} alt="feedback" className="img-fluid img-thumbnail" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default FeedbackPage;