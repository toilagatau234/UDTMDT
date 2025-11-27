import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/apiService';
import useAddressData from '../../hooks/useAddressData';
import { toast } from 'react-hot-toast';
import { UserWrapper, UserPageHeader } from './style'

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    role: 'user',
    address: {
      province: '',
      district: '',
      ward: '',
      street: '',
    },
  });
  const [loading, setLoading] = useState(true);
  
  // Dùng hook địa chỉ
  const { provinces, districts, wards, handleProvinceChange, handleDistrictChange, setInitialDistricts, setInitialWards } = useAddressData();
  
  // State để lưu ID địa chỉ (vì form lưu tên)
  const [addressIds, setAddressIds] = useState({ provinceId: '', districtId: '' });

  // Tải dữ liệu user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/users/${id}`);
        const user = response.data;
        
        // Populate form
        setFormData({
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address ? { // Xử lý nếu user không có địa chỉ
            province: user.address.province || '',
            district: user.address.district || '',
            ward: user.address.ward || '',
            street: user.address.street || '',
          } : { province: '', district: '', ward: '', street: '' }
        });

      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error('Không thể tải thông tin user.');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);
  
  // Xử lý khi provinces (dữ liệu địa chỉ) đã tải xong
  useEffect(() => {
    if (provinces.length > 0 && formData.address.province) {
      const province = provinces.find(p => p.Name === formData.address.province);
      if (province) {
        setAddressIds(prev => ({ ...prev, provinceId: province.Id }));
        setInitialDistricts(province.Id); // Tải danh sách Huyện
        
        const district = province.Districts.find(d => d.Name === formData.address.district);
        if (district) {
          setAddressIds(prev => ({ ...prev, districtId: district.Id }));
          setInitialWards(province.Id, district.Id); // Tải danh sách Xã
        }
      }
    }
  }, [provinces, formData.address, setInitialDistricts, setInitialWards]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const selectedText = e.target.options[e.target.selectedIndex].text;
    
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: selectedText
      }
    }));
    
    if (name === 'province') {
      setAddressIds({ provinceId: value, districtId: '' });
      handleProvinceChange(value);
      // Reset district/ward trong form data
      setFormData(prev => ({ ...prev, address: { ...prev.address, district: '', ward: '' }}));
    } else if (name === 'district') {
      setAddressIds(prev => ({ ...prev, districtId: value }));
      handleDistrictChange(value);
      // Reset ward trong form data
      setFormData(prev => ({ ...prev, address: { ...prev.address, ward: '' }}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // API Sửa User không cần password
    const { password, ...payload } = formData; 
    
    try {
      await apiService.put(`/users/${id}`, payload);
      toast.success('Cập nhật người dùng thành công!');
      navigate('/users');
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !provinces.length) {
    return <div className="spinner-border text-primary" role="status"></div>;
  }

  return (
    <UserWrapper>
      <UserPageHeader>
        <div>
          <h2>Edit User</h2>
        </div>
        <div>
          <Link to="/admin/users" className="btn btn-primary">Back to Users</Link>
        </div>
      </UserPageHeader>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="fullname" className="form-control" value={formData.fullname} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Role</label>
                      <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Street</label>
                      <input 
                        type="text" 
                        name="street" 
                        className="form-control" 
                        value={formData.address.street} 
                        onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))} 
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Province</label>
                      <select name="province" className="form-select" value={addressIds.provinceId} onChange={handleAddressChange}>
                        <option value="">Select Province</option>
                        {provinces.map(p => <option key={p.Id} value={p.Id}>{p.Name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>District</label>
                      <select name="district" className="form-select" value={addressIds.districtId} onChange={handleAddressChange}>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Ward</label>
                      {/* Cần tìm Id của Phường/Xã từ tên đã lưu */}
                      <select 
                        name="ward" 
                        className="form-select" 
                        value={wards.find(w => w.Name === formData.address.ward)?.Id || ''} 
                        onChange={handleAddressChange}
                      >
                        <option value="">Select Ward</option>
                        {wards.map(w => <option key={w.Id} value={w.Id}>{w.Name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
};

export default UserEditPage;