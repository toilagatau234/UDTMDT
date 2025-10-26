import { useState, useEffect } from 'react';
import AdminNav from '../../components/AdminNav';
import axios from 'axios';

export const Type = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newType, setNewType] = useState('');
  const [danhmuc, setDanhmuc] = useState([]);
  const [editType, setEditType] = useState('');
  const [editId, setEditId] = useState('');

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewType('');
  };

  const handleOpenEditDialog = (type, id) => {
    setEditType(type);
    setEditId(id);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditType('');
    setEditId('');
  };

  const handleSaveType = async () => {
    if (newType.trim() === '') {
      alert('Tên dịch vụ không được để trống!');
      return;
    }

    try {
      const response = await axios.post('/api/danhmuc/them', { tenDM: newType });
      console.log('dữ liệu lấy:', response.data);
      setDanhmuc([...danhmuc, { id: response.data._id, name: newType }]);
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi lưu danh mục", error.response ? error.response.data : error.message);
    }
  };

  const handleUpdateType = async () => {
    if (editType.trim() === '') {
      alert('Danh mục không được rỗng');
      return;
    }

    try {
      const response = await axios.patch(`/api/danhmuc/chinh/${editId}`, { tenDM: editType });
      console.log('dữ liệu lấy:', response.data);
      setDanhmuc(danhmuc.map(category => category.id === editId ? { ...category, name: editType } : category));
      handleEditDialogClose();
    } catch (error) {
      console.error("Lỗi cập nhật danh mục", error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteDanhmuc = async (id) => {
    try {
      await axios.delete(`/api/danhmuc/${id}`);
      fetchDanhmuc();
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
    }
  };

  const fetchDanhmuc = async () => {
    try {
      const response = await axios.get('/api/danhmuc');
      const tendanhmuc = response.data.map(danh_muc => ({
        id: danh_muc._id,
        name: danh_muc.tenDM,
   
      }));
      setDanhmuc(tendanhmuc);
    } catch (error) {
      console.error("Lỗi đổ dữ liệu", error);
    }
  };

  useEffect(() => {
    fetchDanhmuc();
  }, []);

  return (
    <>
      <AdminNav>
        <div className="ml-24 flex-1 flex flex-col gap-5">
          <div className="flex justify-between items-center p-6 bg-neutral-100 shadow-md">
            <h1 className="text-lg font-bold text-gray-900">Danh mục</h1>
          </div>

          <div className="flex gap-16">
            <button
              className="bg-slate-900 rounded-lg p-2 text-white font-semibold flex gap-1"
              onClick={handleOpenDialog}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              Thêm mới
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal ">
                <tr>
                  <th className="py-3 px-6  text-center w-1/2">Tên danh mục</th>
                  <th className="py-3 px-6 text-center w-1/2">Chỉnh</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {danhmuc.map((category) => (
                  <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-20 text-center font-medium">{category.name}</td>
                    <td className="py-3 px-80 flex gap-3 ">
                      <button onClick={() => handleOpenEditDialog(category.name, category.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteDanhmuc(category.id)} >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

     
          {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white rounded-lg p-5 w-1/3">
                <h2 className="text-lg font-semibold mb-4">Thêm danh mục mới</h2>
                <input
                  type="text"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Nhập tên danh mục"
                  className="border focus:outline-none rounded w-full p-2 mb-4"
                />
                <div className="flex justify-end">
                  <button className="bg-gray-300  text-white px-4 py-2 rounded" onClick={handleCloseDialog}>
                    Đóng
                  </button>
                  <button className="bg-slate-500 text-white px-4 py-2 rounded ml-2" onClick={handleSaveType}>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}

        
          {isEditDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white rounded-lg p-5 w-1/3">
                <h2 className="text-lg font-semibold mb-4">Chỉnh sửa danh mục</h2>
                <input
                  type="text"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  placeholder="Nhập tên dịch vụ"
                  className="border rounded w-full p-2 mb-4"
                />
                <div className="flex justify-end">
                  <button className="bg-gray-300 text-white px-4 py-2 rounded" onClick={handleEditDialogClose}>
                    Đóng
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2" onClick={handleUpdateType}>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminNav>
    </>
  );
};

export default Type;