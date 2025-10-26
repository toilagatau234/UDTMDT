import { useNavigate } from 'react-router-dom';
import { useState, useEffect  } from "react";
import axios from 'axios';
import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdArrowUp  } from "react-icons/io";
import { IoArrowDown } from "react-icons/io5";

function TimKiemDichVu() {
    const navigate = useNavigate();
    const [dichvu, setDichvu] = useState([]); 
    const [tong, setTong] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tongPages, setTongPages] = useState(1);

    const query = new URLSearchParams(window.location.search); 
    const search = query.get('search');
    const page = parseInt(query.get('trang')) || 1;
    const sort = query.get('loc') || 'phobien';

    useEffect(() => {
        const fetchDanhmucData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/dichvu/search/timkiem?search=${search}&sort=${sort}&page=${page}`);
                setDichvu(response.data.dichvu);
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
    }, [sort, page, search]);

    const handleSortChange = (newSort) => {
        navigate(`?search=${search}&loc=${newSort}&trang=1`);
    };
    
    const handlePageChange = (newPage) => {
        const pageNumber = parseInt(newPage);
        navigate(`?search=${search}&loc=${sort}&trang=${pageNumber}`);
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
                <p className='mr-10 ml-10 mb-5 text-3xl'>Kết quả cho  <span className='font-bold'>{search}</span></p>
                <div className='flex justify-between bg-pink-50 py-2 px-3 mr-10 ml-10 mb-5 rounded-lg shadow '>
                    <div className='flex items-center'>
                        <p className='mr-3'>Sắp xếp theo</p>
                        <button 
                            onClick={() => handleSortChange('phobien')} 
                            className={`px-3 py-1  mr-2 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${sort === 'phobien' ? 'bg-pink-400 text-white' : 'bg-white '}`}>
                            Phổ biến
                        </button>
                        <button 
                            onClick={() => handleSortChange('moinhat')}  
                            className={`px-3 py-1  mr-2 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${sort === 'moinhat' ? 'bg-pink-400 text-white' : 'bg-white '}`}>
                            Mới nhất
                        </button>
                        <button 
                            onClick={() => handleSortChange('nhieunguoidat')}  
                            className={`px-3 py-1  mr-2 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${sort === 'nhieunguoidat' ? 'bg-pink-400 text-white' : 'bg-white'}`}>
                            Nhiều người đặt
                        </button>
                        <button 
                            onClick={() => handleSortChange('giatang')}  
                            className={`flex items-center px-3 py-1 mr-2 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${sort === 'giatang' ? 'bg-pink-400 text-white' : 'bg-white '}`}>
                            Giá <IoMdArrowUp/>
                        </button>
                        <button 
                            onClick={() => handleSortChange('giagiam')}  
                            className={`flex items-center px-3 py-1 mr-2 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200 ${sort === 'giagiam' ? 'bg-pink-400 text-white' : 'bg-white '}`}>
                            Giá <IoArrowDown/>
                        </button>
                    </div>
                    <div className='flex items-center'>
                        <p className='mr-3'>{page}/{tongPages}</p>
                        <button 
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className='p-2 bg-white mr-2 rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200'>
                            <FaAngleLeft/>
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === tongPages}
                            className='p-2 bg-white rounded-lg shadow hover:bg-pink-400 hover:text-white transition duration-200'>
                            <FaAngleRight/>
                        </button>
                    </div>
                </div>
                <p className='ml-10 text-base text-gray-500 mb-2'>{tong} Dịch vụ</p>
                <div>
                    {dichvu.length === 0 ? (
                        <div className="text-center text-gray-600 text-lg font-medium">
                            Không có dịch vụ nào trong danh mục này.
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

export default TimKiemDichVu;
