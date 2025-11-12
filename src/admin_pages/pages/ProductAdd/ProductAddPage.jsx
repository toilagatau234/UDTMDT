import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { ProductWrapper, ProductHeader, ProductFilters } from '../Product/style'

// Component con để quản lý Variants
const VariantManager = ({ variants, setVariants }) => {
  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', quantity: 0, price: 0 }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setVariants(updatedVariants);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">Product Variants (Color, Size, Quantity, Price)</h5>
      </div>
      <div className="card-body">
        {variants.map((variant, index) => (
          <div className="row align-items-center mb-2" key={index}>
            <div className="col-md-3">
              <input type="text" name="color" className="form-control" placeholder="Color (e.g., Red)" value={variant.color} onChange={(e) => handleChange(index, e)} required />
            </div>
            <div className="col-md-3">
              <input type="text" name="size" className="form-control" placeholder="Size (e.g., L)" value={variant.size} onChange={(e) => handleChange(index, e)} required />
            </div>
            <div className="col-md-3">
              <input type="number" name="quantity" className="form-control" placeholder="Quantity" value={variant.quantity} onChange={(e) => handleChange(index, e)} required min="0" />
            </div>
            <div className="col-md-2">
              <input type="number" name="price" className="form-control" placeholder="Price (nếu khác)" value={variant.price} onChange={(e) => handleChange(index, e)} min="0" />
            </div>
            <div className="col-md-1">
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVariant(index)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-success btn-sm" onClick={addVariant}>
          <i className="fas fa-plus"></i> Add Variant
        </button>
      </div>
    </div>
  );
};

// Component chính
const ProductAddPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isFlashSale: false,
    flashSalePrice: 0,
  });
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tải Categories cho dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get('/categories?status=true&limit=100');
        setCategories(response.data.categories || []);
        if (response.data.categories.length > 0) {
          // Set category mặc định
          setFormData(prev => ({ ...prev, category: response.data.categories[0]._id }));
        }
      } catch (error) {
        toast.error('Không thể tải danh mục.');
      }
    };
    fetchCategories();
  }, []);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Xử lý upload ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };
  
  // Xóa ảnh (preview)
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(previews => {
      // Thu hồi URL
      URL.revokeObjectURL(previews[index]);
      return previews.filter((_, i) => i !== index);
    });
  };

  // Thu hồi object URLs khi component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Xử lý Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Vui lòng tải lên ít nhất một hình ảnh.');
      return;
    }
    if (variants.length === 0) {
      toast.error('Vui lòng thêm ít nhất một biến thể.');
      return;
    }

    setLoading(true);

    // Sử dụng FormData để upload file
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('isFlashSale', formData.isFlashSale);
    data.append('flashSalePrice', formData.flashSalePrice);
    
    // Append variants (JSON string)
    data.append('variants', JSON.stringify(variants));

    // Append images (File objects)
    images.forEach(imageFile => {
      data.append('images', imageFile);
    });

    try {
      await apiService.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Thêm sản phẩm thành công!');
      navigate('/products');
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductWrapper>
      <ProductHeader>
        <div>
          <h2>Add Product</h2>
        </div>
        <div>
          <Link to="/admin/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </ProductHeader>

      <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Default Price (khi chưa chọn biến thể)</label>
                      <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required min="0" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Flash Sale Price (nếu có)</label>
                      <input type="number" name="flashSalePrice" className="form-control" value={formData.flashSalePrice} onChange={handleChange} min="0" />
                    </div>
                    <div className="form-check">
                      <input type="checkbox" name="isFlashSale" className="form-check-input" checked={formData.isFlashSale} onChange={handleChange} />
                      <label className="form-check-label">Is Flash Sale?</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Variants */}
            <VariantManager variants={variants} setVariants={setVariants} />

            {/* Image Upload */}
            <div className="card">
              <div className="card-header"><h5 className="card-title">Product Images</h5></div>
              <div className="card-body">
                <input type="file" className="form-control" onChange={handleImageChange} multiple accept="image/*" />
                <div className="mt-3 d-flex flex-wrap">
                  {imagePreviews.map((previewUrl, index) => (
                    <div key={index} className="position-relative me-2 mb-2" style={{ width: '100px', height: '100px' }}>
                      <img src={previewUrl} alt="preview" className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        className="btn btn-danger btn-sm position-absolute" 
                        style={{ top: 0, right: 0 }}
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-end mb-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
    </ProductWrapper>
  );
};

export default ProductAddPage;