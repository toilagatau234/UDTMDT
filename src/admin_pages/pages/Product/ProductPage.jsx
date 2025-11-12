import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Switch from 'react-switch';
import Pagination from '../../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import { ProductWrapper, ProductHeader, ProductFilters } from './style'

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter by Category
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  // Tải danh mục cho filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get('/categories?status=true&limit=100');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories for filter:', error);
      }
    };
    fetchCategories();
  }, []);

  // Hàm gọi API
  const fetchProducts = useCallback(async (page, search = '', category = '') => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        search: search,
        category: category,
      };
      const response = await apiService.get('/products', { params });
      
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Không thể tải sản phẩm.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Lấy dữ liệu
  useEffect(() => {
    fetchProducts(currentPage, searchTerm, categoryFilter);
  }, [fetchProducts, currentPage, searchTerm, categoryFilter]);

  // Xử lý Pagination và Search/Filter
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  // --- Xử lý Actions ---

  // Toggle Status
  const handleToggleStatus = async (product) => {
    const newStatus = !product.status;
    const toastId = toast.loading('Đang cập nhật...');
    try {
      await apiService.put(`/products/toggle-status/${product._id}`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công!', { id: toastId });
      
      setProducts(products.map(p =>
        p._id === product._id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error('Cập nhật thất bại.', { id: toastId });
    }
  };

  // Xử lý Xóa (Delete)
  const handleDelete = (product) => {
    toast((t) => (
      <span>
        Bạn có chắc muốn xóa <b>{product.name}</b>?
        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => {
            confirmDelete(product._id);
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
      await apiService.delete(`/products/${id}`);
      toast.success('Xóa sản phẩm thành công!', { id: toastId });
      fetchProducts(currentPage, searchTerm, categoryFilter); // Tải lại
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Xóa thất bại.', { id: toastId });
    }
  };

  return (
    <ProductWrapper>
      <ProductHeader>
        <div>
          <h2>Products</h2>
        </div>
        <div>
          <Link to="/admin/product/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Product
          </Link>
        </div>
      </ProductHeader>

      {/* Thanh Search & Filter */}
      <ProductFilters>
        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm tên sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-select">
          <select className="form-select" value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </ProductFilters>

      {/* Bảng Product */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <img 
                              src={product.images?.[0] || '/assets/img/logo.svg'} 
                              alt={product.name} 
                              className="avatar avatar-sm me-2" 
                              style={{ objectFit: 'cover' }}
                            />
                          </td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.name}
                          </td>
                          <td>{product.category?.name || 'N/A'}</td>
                          <td>{formatCurrency(product.price)}</td>
                          <td>
                            {/* Tính tổng tồn kho từ variants */}
                            {product.variants?.reduce((total, v) => total + (v.quantity || 0), 0)}
                          </td>
                          <td>
                            <Switch
                              onChange={() => handleToggleStatus(product)}
                              checked={product.status}
                              onColor="#00D285"
                              height={15}
                              width={35}
                            />
                          </td>
                          <td className="text-end">
                            <Link to={`/admin/product/edit/${product._id}`} className="btn btn-sm btn-warning me-2">
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(product)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No products found.</td>
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
    </ProductWrapper>
  );
};

export default ProductPage;