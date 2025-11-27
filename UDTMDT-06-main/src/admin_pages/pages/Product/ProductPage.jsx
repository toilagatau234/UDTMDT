import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import Switch from 'react-switch';
import Pagination from '../../components/Pagination/Pagination';
import { Link } from 'react-router-dom';
import { ProductWrapper, ProductHeader, ProductFilters } from './style';

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
};

// --- HÀM HELPER QUAN TRỌNG: Lấy thông tin hiển thị chuẩn ---
const getProductDisplayInfo = (product) => {
    // 1. Lấy Ảnh
    let image = '/assets/img/product-placeholder.jpg'; // Ảnh mặc định
    
    // Check ảnh ở root (Schema mới)
    if (product.images && product.images.length > 0) {
        const firstImg = product.images[0];
        // Xử lý cả 2 trường hợp: chuỗi url hoặc object {url: ...}
        image = typeof firstImg === 'object' ? firstImg.url : firstImg;
    } 
    // Fallback: Check ảnh trong variations (Data cũ)
    else if (product.variations && product.variations.length > 0) {
        // Data cũ có thể để ảnh trong variation đầu tiên
        image = product.variations[0].image || image;
    }

    // 2. Lấy Giá
    let price = product.price;
    // Fallback: Nếu giá gốc = 0, lấy giá của biến thể đầu tiên
    if ((!price || price === 0) && product.variations && product.variations.length > 0) {
        price = product.variations[0].price;
    }

    // 3. Lấy Tồn kho
    let stock = product.countInStock;
    // Fallback: Nếu kho gốc = 0, cộng dồn kho của các biến thể
    if ((!stock || stock === 0) && product.variations && product.variations.length > 0) {
        stock = product.variations.reduce((acc, curr) => acc + (curr.stock || curr.quantity || 0), 0);
    }

    return { image, price, stock };
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  // Tải danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get('/categories?status=true&limit=100');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
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
      const responseData = response.data;

      // Lấy dữ liệu từ trường 'data' (chuẩn backend mới)
      setProducts(responseData.data || []);

      // Tính total pages
      const totalItems = responseData.total || 0;
      const pageSize = responseData.pageSize || limit;
      setTotalPages(Math.ceil(totalItems / pageSize) || 1);

      setCurrentPage(responseData.currentPage || 1);

    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Không thể tải sản phẩm.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts(currentPage, searchTerm, categoryFilter);
  }, [fetchProducts, currentPage, searchTerm, categoryFilter]);

  // Handlers
  const handlePageChange = (page) => setCurrentPage(page);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'in_stock' ? 'out_of_stock' : 'in_stock';
    const toastId = toast.loading('Đang cập nhật...');
    try {
      await apiService.put(`/products/${product._id}`, { status: newStatus });
      toast.success('Cập nhật thành công!', { id: toastId });
      
      setProducts(products.map(p =>
        p._id === product._id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      toast.error('Cập nhật thất bại.', { id: toastId });
    }
  };

  const handleDelete = (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa ${product.name}?`)) {
        confirmDelete(product._id);
    }
  };

  const confirmDelete = async (id) => {
    const toastId = toast.loading('Đang xóa...');
    try {
      await apiService.delete(`/products/${id}`);
      toast.success('Xóa thành công!', { id: toastId });
      fetchProducts(currentPage, searchTerm, categoryFilter);
    } catch (error) {
      toast.error('Xóa thất bại.', { id: toastId });
    }
  };

  return (
    <ProductWrapper>
      <ProductHeader>
        <div><h2>Products</h2></div>
        <div>
          <Link to="/admin/product/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Product
          </Link>
        </div>
      </ProductHeader>

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
                      <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                    ) : products.length > 0 ? (
                      products.map((product) => {
                        // Gọi hàm helper để lấy dữ liệu chuẩn
                        const { image, price, stock } = getProductDisplayInfo(product);

                        return (
                          <tr key={product._id}>
                            <td>
                              <div className="product-item">
                                <img
                                  src={image}
                                  alt={product.name}
                                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/img/product-placeholder.jpg' }}
                                />
                              </div>
                            </td>
                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.name}
                            </td>
                            <td>
                              {product.category?.name || <span className="text-muted">N/A</span>}
                            </td>
                            <td>{formatCurrency(price)}</td>
                            <td>{stock}</td>
                            <td>
                              <Switch
                                onChange={() => handleToggleStatus(product)}
                                checked={product.status === 'in_stock'}
                                onColor="#00D285"
                                height={15}
                                width={35}
                              />
                            </td>
                            <td className="text-end">
                              <Link
                                to={`/admin/product/edit/${product._id}`}
                                className="btn btn-sm btn-warning me-2"
                              >
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
                        );
                      })
                    ) : (
                      <tr><td colSpan="7" className="text-center">No products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </ProductWrapper>
  );
};

export default ProductPage;