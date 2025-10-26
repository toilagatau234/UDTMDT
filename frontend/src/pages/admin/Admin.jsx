import axios from 'axios';
import AdminNav from "../../components/AdminNav";
import { useEffect, useState } from 'react';

export const Admin = () => {
  const [nguoiDung, setNguoiDung] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  const fetchNguoiDung = async () => {
    try {
      const response = await axios.get('/api/user/layhet');
      const cacNguoiDung = response.data.map(ND => ({
        id: ND._id,
        name: ND.tenNguoiDung,
        email: ND.email,
        role: ND.vaiTro,
        img: ND.anhND
      }));
      setNguoiDung(cacNguoiDung);
    } catch (error) {
      console.error("Lỗi đổ dữ liệu", error);
    }
  };

  const fetchtheoRole = async (vaiTro) => {
    try {
      const response = await axios.get(`/api/user/laytheorole?role=${vaiTro}`);
      const cacNguoiDung = response.data.map(ND => ({
        id: ND._id,
        name: ND.tenNguoiDung,
        email: ND.email,
        role: ND.vaiTro,
        img: ND.anhND
      }));
      setNguoiDung(cacNguoiDung);
    } catch (error) {
      console.error("Lỗi đổ dữ liệu", error);
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setSelectedRole(selectedRole);
    if (selectedRole) {
      fetchtheoRole(selectedRole);
    } else {
      fetchNguoiDung();
    }
  };

  const handleUserAction = async (id, currentRole) => {
    try {
      if (currentRole === 'blocked') {
        await axios.put(`/api/user/tralaiquyen/${id}`);
      } else {
        await axios.put(`/api/user/vohieuhoa/${id}`);
      }
      fetchNguoiDung();
    } catch (error) {
      console.error("Lỗi khi thay đổi quyền người dùng", error);
    }
  };

  useEffect(() => {
    fetchNguoiDung();
  }, []);

  return (
    <>
      <AdminNav>
        <div className="ml-24 flex-1 flex flex-col">
          <div className="flex justify-between items-center p-6 bg-neutral-100 shadow-md">
            <h1 className="text-lg font-bold text-gray-500">DASHBOARD</h1>
          </div>

          <div className="flex p-6">
            <label htmlFor="role" className="mr-4">Lọc theo vai trò:</label>
            <select
              id="role"
              value={selectedRole}
              onChange={handleRoleChange}
              className="p-2 border focus:outline-none border-gray-300 rounded-md"
            >
              <option value="">Tất cả</option>
              <option value="freelancer">Freelancer</option>
              <option value="user">Customer</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Ảnh</th>
                  <th className="px-4 py-2 text-left">Tên người dùng</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Chức vụ</th>
                  <th className="px-4 py-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {nguoiDung.map((ND, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <img src={ND.img} alt={ND.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-4 py-2">{ND.name}</td>
                    <td className="px-4 py-2">{ND.email}</td>
                    <td className="px-4 py-2">{ND.role}</td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => handleUserAction(ND.id, ND.role)} 
                        className={`text-${ND.role === 'blocked' ? 'blue' : 'red'}-500 hover:text-${ND.role === 'blocked' ? 'blue' : 'red'}-700`}
                      >
                        {ND.role === 'blocked' ? 'Khôi phục quyền' : 'Vô hiệu hóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminNav>
    </>
  );
};

export default Admin;
