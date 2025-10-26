import CategoriesMenu from "../../components/user/CategoriesMenu";
import Header from "../../components/user/Header";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [dichVuPhoBien, setDichVuPhoBien] = useState([]);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchDichVuData = async () => {
            try {
                const response = await axios.get('api/dichvu/lay/dichvu/trangchu');
                setDichVuPhoBien(response.data.dichVuPhoBien);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDichVuData();
    }, []);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Đang tải...</div>;

    return (
        <div className="container mx-auto">
            <div id="Header" className="mb-6 px-4">
                <Header />
            </div>
            
            <div id="CategoriesMenu" className="px-4">
                <CategoriesMenu />
            </div>
            <div className='content'>
                <img src="../../../public/4267109.jpg" alt="Ảnh trang chủ" className="h-60 w-full object-cover" />
                
                <div className="absolute top-1/3 left-1/4 font-bold text-3xl text-white">
                    Chào mừng trở lại, {user.tenNguoiDung}
                </div>

                <div>
                    {dichVuPhoBien.length === 0 ? (
                        <div className="text-center text-gray-600 text-lg font-medium">
                            Không có dịch vụ nào trong dịch vụ phổ biến này.
                        </div>
                    ) : (
                        <>
                            <p className="mx-10 font-semibold text-xl my-5"> Dịch vụ phổ biến</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-10 mt-0">
                                {dichVuPhoBien.map((dv) => (
                                    <div
                                        key={dv._id}
                                        onClick={() => {
                                            const urlTenND = dv?.idNguoiDungDV?.tenNguoiDung.replace(/\s+/g, '-');
                                            const urlTenDV = dv?.tenDichVu.replace(/\s+/g, '-');
                                            navigate(`/${urlTenND}/${urlTenDV}`, {
                                                state: { id: dv?._id },
                                            });
                                        }}
                                        className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl"
                                    >
                                        <img
                                            src={dv.anhDichVu || 'https://placehold.co/60x60/FF69B4/FFFFFF'}
                                            alt={dv.tenDichVu || 'Dich vu image'}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                        <div className="p-4">
                                            <div className='flex mb-3'>
                                                <img
                                                    alt="Profile picture" 
                                                    className="rounded-full w-6 h-6 mr-2" 
                                                    src={dv?.idNguoiDungDV?.anhND || "https://placehold.co/20x20/FF69B4/FFFFFF"}
                                                />
                                                <h1 className='text-lg font-semibold'>{dv?.idNguoiDungDV?.tenNguoiDung || "Tên người dùng không có"}</h1>
                                            </div>
                                            <h2 className="text-lg text-gray-800 mb-2 capitalize">{dv.tenDichVu}</h2>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xl font-bold text-green-600">
                                                    Từ {dv.phanLoai?.coban?.giaLoai?.toLocaleString() || 'N/A'} đ
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Home;
