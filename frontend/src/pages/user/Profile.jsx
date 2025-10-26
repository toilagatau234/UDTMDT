import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";
import Sidebar from "../../components/user/Sidebar";
import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        tenNguoiDung: '',
        email: '',
        soDienThoai: '',
        diaChi: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/auth/getme');
                setUser(response.data);
                setFormData({
                    tenNguoiDung: response.data.tenNguoiDung,
                    email: response.data.email,
                    soDienThoai: response.data.soDienThoai || '',
                    diaChi: response.data.diaChi || ''
                });
            } catch (err) {
                setError('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
                console.error(err);
            }
        };
    
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.patch('/api/user/update', formData);
            setUser(response.data.nguoidung);
            setError(null); 
            alert('Cập nhật thông tin thành công!');
        } catch (err) {
            setError('Không thể cập nhật thông tin. Vui lòng thử lại.');
            console.error(err);
        }
    };

    if (error) return <div>{error}</div>;
    if (!user) return <div>Đang tải...</div>;

    return (
        <div className='container mx-auto px-4'>
            <div id="Header" className="mb-6">
                <Header />
            </div>
            <div id="CategoriesMenu" className="mb-8">
                <CategoriesMenu />
            </div>
            <div className='content p-8 flex'>
                <div className="profile-sidebar bg-pink-300 w-1/4 p-4 rounded-lg shadow-lg">
                    <Sidebar />
                </div>
                <div className="profile-content w-3/4 ml-8 p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Thông tin người dùng</h1>
                    <form onSubmit={handleUpdate}>
                        <p className="text-xl text-gray-700 mb-4">Tên:
                            <input
                                type="text"
                                name="tenNguoiDung"
                                value={formData.tenNguoiDung}
                                onChange={handleChange}
                                className="font-semibold text-pink-600"
                            />
                        </p>
                        <p className="text-xl text-gray-700 mb-4">Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="font-semibold text-pink-600"
                            />
                        </p>
                        <p className="text-xl text-gray-700 mb-4">
                            {user.soDienThoai && (
                                <>
                                    Số điện thoại:
                                    <input
                                        type="text"
                                        name="soDienThoai"
                                        value={formData.soDienThoai}
                                        onChange={handleChange}
                                        className="font-semibold text-pink-600"
                                    />
                                </>
                            )}
                        </p>
                        <p className="text-xl text-gray-700 mb-4">
                            {user.diaChi && (
                                <>
                                    Địa chỉ:
                                    <input
                                        type="text"
                                        name="diaChi"
                                        value={formData.diaChi}
                                        onChange={handleChange}
                                        className="font-semibold text-pink-600"
                                    />
                                </>
                            )}
                        </p>
                        <div className="text-right">
                            <button type="submit" className="bg-pink-500 text-white px-6 py-2 rounded-lg">
                                Cập nhật thông tin
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
