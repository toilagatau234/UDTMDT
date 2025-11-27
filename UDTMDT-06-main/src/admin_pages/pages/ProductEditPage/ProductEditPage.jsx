import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { ProductWrapper, ProductHeader } from '../Product/style'

// (VariantManager component - sử dụng từ ProductAddPage)
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
      <div className="card-header"><h5 className="card-title">Product Variants</h5></div>
      <div className="card-body">
        {variants.map((variant, index) => (
          <div className="row align-items-center mb-2" key={index}>
            <div className="col-md-3"><input type="text" name="color" className="form-control" placeholder="Color" value={variant.color} onChange={(e) => handleChange(index, e)} required /></div>
            <div className="col-md-3"><input type="text" name="size" className="form-control" placeholder="Size" value={variant.size} onChange={(e) => handleChange(index, e)} required /></div>
            <div className="col-md-3"><input type="number" name="quantity" className="form-control" placeholder="Quantity" value={variant.quantity} onChange={(e) => handleChange(index, e)} required min="0" /></div>
            <div className="col-md-2"><input type="number" name="price" className="form-control" placeholder="Price" value={variant.price} onChange={(e) => handleChange(index, e)} min="0" /></div>
            <div className="col-md-1"><button type="button" className="btn btn-danger btn-sm" onClick={() => removeVariant(index)}><i className="fas fa-trash"></i></button></div>
          </div>
        ))}
        <button type="button" className="btn btn-success btn-sm" onClick={addVariant}><i className="fas fa-plus"></i> Add Variant</button>
      </div>
    </div>
  );
};

// Component chính
const ProductEditPage = () => {
  const { id } = useParams();
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
  
  // Quản lý ảnh:
  const [existingImages, setExistingImages] = useState([]); // Ảnh cũ (URLs)
  const [newImages, setNewImages] = useState([]); // Ảnh mới (Files)
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Previews cho ảnh mới
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Tải Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get('/categories?status=true&limit=100');
        setCategories(response.data.categories || []);
      } catch (error) {
        toast.error('Không thể tải danh mục.');
      }
    };
    fetchCategories();
  }, []);

  // Tải Dữ liệu Sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setPageLoading(true);
        const response = await apiService.get(`/products/${id}`);
        const product = response.data;
        
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category._id, // API trả về category object
          isFlashSale: product.isFlashSale || false,
          flashSalePrice: product.flashSalePrice || 0,
        });
        setVariants(product.variants || []);
        setExistingImages(product.images || []);
        
      } catch (error) {
        toast.error('Không thể tải dữ liệu sản phẩm.');
        navigate('/products');
      } finally {
        setPageLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);
  
  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Xử lý upload ảnh MỚI
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };
  
  // Xóa ảnh CŨ (existing)
  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };
  
  // Xóa ảnh MỚI (preview)
  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(previews => {
      URL.revokeObjectURL(previews[index]);
      return previews.filter((_, i) => i !== index);
    });
  };

  // Thu hồi object URLs
  useEffect(() => {
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  // Xử lý Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('Sản phẩm phải có ít nhất một hình ảnh.');
      return;
    }
    if (variants.length === 0) {
      toast.error('Vui lòng thêm ít nhất một biến thể.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    
    // Append fields
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    // Append variants
    data.append('variants', JSON.stringify(variants));
    
    // Append existing images (URLs)
    data.append('existingImages', JSON.stringify(existingImages));
    
    // Append new images (Files)
    newImages.forEach(imageFile => {
      data.append('images', imageFile); // API sẽ nhận 'images' là mảng file mới
    });

    try {
      await apiService.put(`/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Cập nhật sản phẩm thành công!');
      navigate('/products');
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  return (
    <ProductWrapper>
      <ProductHeader>
        <div>
          <h2>Edit Product</h2>
        </div>
        <div>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </ProductHeader>

      <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6"><div className="form-group"><label>Product Name</label><input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required /></div></div>
                  <div className="col-md-6"><div className="form-group"><label>Category</label><select name="category" className="form-select" value={formData.category} onChange={handleChange} required>{categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}</select></div></div>
                  <div className="col-12"><div className="form-group"><label>Description</label><textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange}></textarea></div></div>
                  <div className="col-md-6"><div className="form-group"><label>Default Price</label><input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required min="0" /></div></div>
                  <div className="col-md-6">
                    <div className="form-group"><label>Flash Sale Price</label><input type="number" name="flashSalePrice" className="form-control" value={formData.flashSalePrice} onChange={handleChange} min="0" /></div>
                    <div className="form-check"><input type="checkbox" name="isFlashSale" className="form-check-input" checked={formData.isFlashSale} onChange={handleChange} /><label className="form-check-label">Is Flash Sale?</label></div>
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
                  {/* Ảnh cũ */}
                  {existingImages.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="position-relative me-2 mb-2" style={{ width: '100px', height: '100px' }}>
                      <img src={imageUrl} alt="existing" className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" className="btn btn-danger btn-sm position-absolute" style={{ top: 0, right: 0 }} onClick={() => removeExistingImage(index)}><i className="fas fa-times"></i></button>
                    </div>
                  ))}
                  {/* Ảnh mới (preview) */}
                  {newImagePreviews.map((previewUrl, index) => (
                    <div key={`new-${index}`} className="position-relative me-2 mb-2" style={{ width: '100px', height: '100px' }}>
                      <img src={previewUrl} alt="preview" className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" className="btn btn-danger btn-sm position-absolute" style={{ top: 0, right: 0 }} onClick={() => removeNewImage(index)}><i className="fas fa-times"></i></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-end mb-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Save Changes'}
              </button>
            </div>
      </form>
    </ProductWrapper>
  );
};

export default ProductEditPage;