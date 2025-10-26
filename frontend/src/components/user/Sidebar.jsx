import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Sidebar() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/auth/getme');
                setUser(response.data);
            } catch (err) {
                setError('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
                console.error(err);
            }
        };

        fetchUserData();
    }, []);


    const handleImageChange = async (event) => {
        const file = event.target.files[0];  
        if (file) {
            const reader = new FileReader(); 
            reader.onloadend = async () => {
                setCoverImage(reader.result);  
                try {
                    const response = await axios.patch('/api/user/update', {
                        anhND: reader.result, 
                    });
                    setUser(response.data.nguoidung);
                } catch (err) {
                    setError('Không thể cập nhật ảnh đại diện. Vui lòng thử lại.');
                    console.error(err);
                }
            };
            reader.readAsDataURL(file);  
        }
    };


    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
    if (!user) return <div className="flex justify-center items-center mt-4"><div className="loader">Đang tải...</div></div>; 

    return (
        <>
            <div className="avata flex items-center justify-center" onClick={handleAvatarClick}>
                <img 
                    src={coverImage || user.anhND || "https://placehold.co/60x60/FF69B4/FFFFFF"} 
                    className="w-20 h-20 mx-2 rounded-full shadow-lg border-2 border-white" 
                    alt="Avatar"
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>
            <p className="text-center text-lg font-semibold mt-3">{user.tenNguoiDung}</p>
            <Link to={'/user/profile'}>
                <div className="flex justify-center items-center bg-pink-200 hover:bg-pink-100 rounded-lg p-4 mt-10 shadow-md cursor-pointer transition duration-200 ease-in-out">
                    <span className="text-gray-700">Thông tin</span>
                </div>
            </Link>
            <Link to={'/user/quanlydonhang/list'}>
                <div className="flex justify-center items-center bg-pink-200 hover:bg-pink-100 rounded-lg p-4 mt-3 mb-10 shadow-md cursor-pointer transition duration-200 ease-in-out">
                    <span className="text-gray-700">Quản lý đơn hàng</span>
                </div>
            </Link>
            {user.vaiTro === "freelancer" && (
                <>
                    <Link to={'/user/quanlydichvu/list'}>
                        <div className="flex justify-center items-center bg-pink-200 hover:bg-pink-100 rounded-lg p-4 mt-3 shadow-md cursor-pointer transition duration-200 ease-in-out">
                            <span className="text-gray-700">Quản lý dịch vụ</span>
                        </div>
                    </Link>

                    <Link to={'/user/quanlydondathang/list'}>
                        <div className="flex justify-center items-center bg-pink-200 hover:bg-pink-100 rounded-lg p-4 mt-3 shadow-md cursor-pointer transition duration-200 ease-in-out">
                            <span className="text-gray-700">Quản lý đơn đặt hàng</span>
                        </div>
                    </Link>

                    <Link to={'/user/quanlygiaodich/list'}>
                        <div className="flex justify-center items-center bg-pink-200 hover:bg-pink-100 rounded-lg p-4 mt-3 shadow-md cursor-pointer transition duration-200 ease-in-out">
                            <span className="text-gray-700">Quản lý giao dịch</span>
                        </div>
                    </Link>
                </>
            )}
        </>
    );
}

export default Sidebar;
