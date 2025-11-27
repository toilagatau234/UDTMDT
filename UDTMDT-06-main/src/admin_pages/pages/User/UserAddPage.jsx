import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import useAddressData from '../../hooks/useAddressData';
import { toast } from 'react-hot-toast';
import { UserWrapper, UserPageHeader } from './style'

const UserAddPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    address: {
      province: '',
      district: '',
      ward: '',
      street: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const { provinces, districts, wards, handleProvinceChange, handleDistrictChange } = useAddressData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Lấy Tên (Name) thay vì ID (Id)
    const selectedText = e.target.options[e.target.selectedIndex].text;
    
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: selectedText // Lưu tên (e.g., "Hà Nội")
      }
    }));
    
    // Cập nhật cascading dropdowns
    if (name === 'province') {
      handleProvinceChange(value); // value ở đây là ID
    } else if (name === 'district') {
      handleDistrictChange(value); // value ở đây là ID
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/users', formData);
      toast.success('Thêm người dùng thành công!');
      navigate('/users');
    } catch (error) {
      console.error('Failed to add user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserWrapper>
      <UserPageHeader>
        <div>
          <h2>Add User</h2>
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
                      <label>Password</label>
                      <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
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
                  <div className="col-md-6">
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
                      <select name="province" className="form-select" onChange={handleAddressChange} required>
                        <option value="">Select Province</option>
                        {provinces.map(p => <option key={p.Id} value={p.Id}>{p.Name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>District</label>
                      <select name="district" className="form-select" onChange={handleAddressChange} required>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d.Id} value={d.Id}>{d.Name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Ward</label>
                      <select name="ward" className="form-select" onChange={handleAddressChange} required>
                        <option value="">Select Ward</option>
                        {wards.map(w => <option key={w.Id} value={w.Id}>{w.Name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
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

export default UserAddPage;