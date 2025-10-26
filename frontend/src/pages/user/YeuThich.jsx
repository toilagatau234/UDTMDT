import { useNavigate } from 'react-router-dom';
import { useState, useEffect  } from "react";
import axios from 'axios';
import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function YeuThich() {
    const navigate = useNavigate();
    const [dichvu, setDichvu] = useState([]); 
    const [tong, setTong] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tongPages, setTongPages] = useState(1);

    const query = new URLSearchParams(window.location.search); 
    const page = parseInt(query.get('trang')) || 1;

    useEffect(() => {
        const fetchDanhmucData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/user/lay/yeuthich?page=${page}`);
                setDichvu(response.data.danhSachYeuThich);
                setTong(response.data.tong);
                setTongPages(response.data.tongPage);
            } catch (err) {
                console.error(err);
                setError("Lỗi tải dịch vụ");
            } finally {
                setLoading(false);
            }
        };

        fetchDanhmucData();
    }, [page]);
    
    const handlePageChange = (newPage) => {
        const pageNumber = parseInt(newPage);
        navigate(`?trang=${pageNumber}`);
    };
    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <div id="Header" className="mb-6">
                <Header />
            </div>
            
            <div id="CategoriesMenu" className="mb-8">
                <CategoriesMenu />
            </div>

            <div className="content">
                <p className='ml-10 text-3xl mb-5 font-bold'>Danh sách yêu thích</p>
                <p className='ml-10 text-base text-gray-500 mb-2'>{tong} Dịch vụ</p>
                <div>
                    {dichvu.length === 0 ? (
                        <div className="text-center text-gray-600 text-lg font-medium">
                            Chưa có dịch vụ yêu thích.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-10 mt-0">
                                {dichvu.map((dv) => (
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
                            <div className="flex justify-center items-center mt-6 mb-10">
                                <button 
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className={`px-4 py-2 mx-1 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}>
                                    <FaAngleLeft />
                                </button>
                                {Array.from({ length: tongPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 mx-1 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${page === index + 1 ? 'bg-pink-400 text-white' : 'bg-white'}`}>
                                        {index + 1}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === tongPages}
                                    className={`px-4 py-2 mx-1 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${page === tongPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'}`}>
                                    <FaAngleRight />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default YeuThich;
