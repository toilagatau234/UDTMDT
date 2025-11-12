import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Switch from 'react-switch';
import Pagination from '../../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../assets/img/avatar.jpg';
import { UserWrapper, UserPageHeader, UserFilter } from './style'

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm gọi API
  const fetchUsers = useCallback(async (page, search = '') => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        search: search,
      };
      const response = await apiService.get('/users', { params });
      
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Lấy dữ liệu
  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [fetchUsers, currentPage, searchTerm]);

  // Xử lý Pagination và Search
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // --- Xử lý Actions ---

  // Toggle Block/Unblock
  const handleToggleStatus = async (user) => {
    const newBlockedStatus = !user.isBlocked;
    const toastId = toast.loading('Đang cập nhật...');
    
    try {
      // Giả sử API endpoint là 'toggle-block'
      await apiService.put(`/users/toggle-block/${user._id}`, { isBlocked: newBlockedStatus });
      toast.success('Cập nhật trạng thái thành công!', { id: toastId });
      
      setUsers(users.map(u =>
        u._id === user._id ? { ...u, isBlocked: newBlockedStatus } : u
      ));
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Cập nhật thất bại.', { id: toastId });
    }
  };

  // Xử lý Xóa (Delete)
  const handleDelete = (user) => {
    toast((t) => (
      <span>
        Bạn có chắc muốn xóa <b>{user.fullname}</b>?
        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => {
            confirmDelete(user._id);
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
      await apiService.delete(`/users/${id}`);
      toast.success('Xóa người dùng thành công!', { id: toastId });
      fetchUsers(currentPage, searchTerm); // Tải lại
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Xóa thất bại. (Không thể xóa admin?)', { id: toastId });
    }
  };

  return (
    <UserWrapper>
      <UserPageHeader>
        <div>
          <h2>Users</h2>
        </div>
        <div>
          <Link to="/admin/user/add" className="btn btn-primary"><i className="fas fa-plus"></i> Add User</Link>
        </div>
      </UserPageHeader>

      {/* Thanh Search */}
      <UserFilter>
        <div className="search-box">
          <input 
            type="text"
            className="form-control"
            placeholder="Tìm kiếm user (tên, email, sđt)..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </UserFilter>

      {/* Bảng User */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Blocked</th>
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
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <h2 className="table-avatar">
                              <span className="avatar avatar-sm me-2">
                                <img
                                  className="avatar-img rounded-circle"
                                  src={user.avatar || defaultAvatar}
                                  alt="User Avatar"
                                />
                              </span>
                              {user.fullname}
                            </h2>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>
                            {user.role === 'admin' ? (
                              <span className="badge badge-pill bg-primary">Admin</span>
                            ) : (
                              <span className="badge badge-pill bg-light text-dark">User</span>
                            )}
                          </td>
                          <td>
                            {/* Switch để Block/Unblock */}
                            <Switch
                              onChange={() => handleToggleStatus(user)}
                              checked={user.isBlocked}
                              onColor="#E63946"
                              onHandleColor="#ffffff"
                              handleDiameter={20}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              height={15}
                              width={35}
                            />
                          </td>
                          <td className="text-end">
                            {/* Link đến trang Edit User */}
                            <Link to={`/admin/user/edit/${user._id}`} className="btn btn-sm btn-warning me-2">
                              <i className="fas fa-edit"></i>
                            </Link>
                            {/* Admin (role) không nên bị xóa */}
                            {user.role !== 'admin' && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(user)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No users found.</td>
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
    </UserWrapper>
  );
};

export default UserPage;