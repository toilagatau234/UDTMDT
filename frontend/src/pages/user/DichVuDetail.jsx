import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import CategoriesMenu from "../../components/user/CategoriesMenu";
import Header from "../../components/user/Header";
import GioHang from '../../components/user/GioHang';
import { FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { GoShareAndroid } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useAuth } from '../../store/AuthStore';
import moment from 'moment';
import ChatBubble from './ChatBubble';


function DichVuDetail() {
    const location = useLocation();
    const { id } = location.state || {};
    const [dichvu, setDichvu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState('coban');
    const [hienthiGiohang, setHienthiGiohang] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [soLuongDanhGia, setSoLuongDanhGia] = useState(0);
    const [trungBinhSao, setTrungBinhSao] = useState(0);
    const [soLuongDanhGiaTungSao, setSoLuongDanhGiaTungSao] = useState([]);
    const [dsDanhGia, setdsDanhGia] = useState([]);
    const [dsDanhGiaLoc, setdsDanhGiaLoc] = useState([]);
    const [soSaoDaChon, setSoSaoDaChon] = useState(0);
    const { authUser } = useAuth();
    

    const handleClickOutside = (event) => {
        if (!event.target.closest('.giohang_button') && !event.target.closest('#giohang')) {
            setHienthiGiohang(false);
        }
    }
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        fetchProductDetails(id);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [id]);

    const handlePackageChange = (packageType) => {
        setSelectedPackage(packageType);
    };

      

    const fetchProductDetails = async (id) => {
        try {
            const response = await Axios.get(`/api/dichvu/lay/${id}`);
            setDichvu(response.data.dichvu);
            setIsFavorite(response.data.isFavorite);
            setFavoriteCount(response.data.favoriteCount);
            setSoLuongDanhGia(response.data.soLuongDanhGia);
            setTrungBinhSao(response.data.trungBinhSao);
            setSoLuongDanhGiaTungSao(response.data.saoCount);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi tải dịch vụ:", error);
            setLoading(false);
        }
    };
    
    const handleAddToCart = async () => {
        if (!dichvu) return;
    
        const service = {
            dichVuId: dichvu._id,
            phanLoai: dichvu.phanLoai?.[selectedPackage],
            soLuong: 1,
        };
    
        try {
            await Axios.post('/api/giohang/them', service);
            setHienthiGiohang(prev => !prev);
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            if (error.response && error.response.status === 403) {
                alert("Bạn không có quyền thực hiện này");
            }
        }
    };
    
    
    useEffect(() => {
        const updateLuotXem = async () => {
            try {
                await Axios.post(`/api/dichvu/capnhat/luotxem/${id}`);
            } catch (error) {
                console.error("Có lỗi khi cập nhật lượt xem:", error);
            }
        };

        updateLuotXem();
    }, [id]);

    const toggleFavorite = async () => {
        try {
            const response = await Axios.post(`/api/user/capnhat/yeuthich/${id}`);
            setIsFavorite(!isFavorite);
            console.log(response.data.message);
        } catch (error) {
            console.error("Lỗi khi cập nhật yêu thích:", error.message);
        }
    };

    useEffect(() => {
        const layDanhGia = async () => {
            try {
                const response = await Axios.get(`/api/dichvu/lay/danhgia/${id}`);
                setdsDanhGia(response.data.danhSachDanhGia);
            } catch (error) {
                console.error("Có lỗi khi cập nhật lượt xem:", error);
            }
        };
        layDanhGia();
    }, [id]);

    useEffect(() => {
        setdsDanhGiaLoc(dsDanhGia);
    }, [dsDanhGia]);

    const locDanhGia = (soSao) => {
        setSoSaoDaChon(soSao);
        setdsDanhGiaLoc(dsDanhGia);
        if (soSao === 0){
            setdsDanhGiaLoc(dsDanhGia);
        } else {
            let filteredDanhGia = dsDanhGia.filter(danhGia => danhGia.soSao  === Number(soSao));
            console.log("Danh sách sau khi lọc:", filteredDanhGia);
            setdsDanhGiaLoc(filteredDanhGia);
        }
        console.log("số Sao:", soSao);
    };
    
    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    };

    if (!dichvu) {
        return <div className="text-center py-12">Không tìm thấy dịch vụ.</div>;
    };

    

    return (
        <div className="containe min-h-screen">
            <div id="Header">
                <Header />
            </div>
            <div id="CategoriesMenu">
                <CategoriesMenu />
            </div>
            <div className="container mx-auto p-4 flex justify-around">
                <div className='w-full pt-10 pr-12 pl-9'>
                    <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-2">
                        <ul className="flex items-center space-x-2">
                            <li>
                                <Link to={'/'}>
                                    <GoHome className="text-xl text-gray-800 hover:text-pink-600 transition duration-200" />
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link 
                                    to={{
                                        pathname: `/categories/${dichvu?.idDanhMucDV?.tenDM.replace(/\s+/g, '-')}`,
                                    }}
                                    state={{ 
                                        id: dichvu?.idDanhMucDV?._id,
                                        tenDM: dichvu?.idDanhMucDV?.tenDM
                                    }}
                                    className="text-gray-800 hover:text-pink-600 transition duration-200"
                                >
                                    {dichvu?.idDanhMucDV?.tenDM}
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <h1 className="text-4xl font-bold mb-2">
                        {dichvu.tenDichVu}
                    </h1>
                    <div className="flex items-start mt-5">
                        <img
                        alt="Profile picture of the developer" 
                        className="rounded-full w-16 h-16 mr-4" 
                        src={dichvu?.idNguoiDungDV?.anhND ? dichvu?.idNguoiDungDV?.anhND : "https://placehold.co/20x20/FF69B4/FFFFFF"}
                        />
                        <div>
                            <h3 className="text-xl font-bold">
                                {dichvu?.idNguoiDungDV?.tenNguoiDung || 'Tên người dùng'}
                            </h3>
                            <div className="flex items-center mb-2">
                                <span className={`flex items-center h-8 ${trungBinhSao === 0 ? 'text-gray-500' : 'font-bold text-yellow-500'}`}>
                                    {trungBinhSao === 0 ? 'Chưa có đánh giá' : trungBinhSao}
                                </span>
                                <FaStar size={15} className={`flex items-center h-8 ml-1 ${trungBinhSao === 0 ? 'text-gray-500' : 'text-yellow-500'}`} />
                                <span className="flex items-center h-8 ml-2 text-gray-600">
                                    ({soLuongDanhGia})
                                </span>
                            </div>
                            <div>
                                {dichvu.kyNang.map((kynang, index) => (
                                    <span key={index} className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm mr-2 mb-2">
                                        {kynang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <img
                            src={dichvu.anhDichVu || 'https://placehold.co/100x300/FF69B4/FFFFFF'}
                            alt={dichvu.tenDichVu || 'Dich vu image'}
                            className="w-full h-80 object-cover rounded-t-lg"
                        />
                    </div>
                    <div className='mt-5'>
                        <h2 className="text-xl font-bold">
                            MÔ TẢ DỊCH VỤ
                        </h2>
                        <p className="mt-4 text-gray-800">
                            {dichvu.moTaDV}
                        </p>
                    </div>
                    <div className='mt-5'>
                        <h2 className="text-xl font-bold">
                            ĐÁNH GIÁ DỊCH VỤ
                        </h2>
                        {soLuongDanhGia === 0 ? (
                            <p className="text-gray-500">Chưa có đánh giá nào</p>
                        ) : (
                            <div className='py-10 px-8 border rounded-md mt-5'>
                                <div className='flex flex-col justify-center items-center mb-5'>
                                    <p className='text-2xl mb-2'>{trungBinhSao} trên 5</p>
                                    <div className="flex">
                                        {[1,2,3,4,5].map((star) => {
                                            if (star <= Math.floor(trungBinhSao)) {
                                                return <FaStar key={star} size={30} className="text-yellow-500 mr-1" />;
                                            } else if (star <= Math.ceil(trungBinhSao) && trungBinhSao % 1 !== 0) {
                                                return <FaStarHalfAlt key={star} size={30} className="text-yellow-500 mr-1" />;
                                            } else {
                                                return <FaRegStar key={star} size={30} className="text-gray-300 mr-1" />;
                                            }
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <button
                                            onClick={() => locDanhGia(0)}
                                            className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 shadow w-full ${
                                                soSaoDaChon === 0 ? "bg-pink-400 text-white" : ""
                                            }`}
                                        >
                                            Tất cả ({soLuongDanhGia})
                                        </button>
                                        <button
                                            onClick={() => locDanhGia(5)}
                                            className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 shadow w-full ${
                                                soSaoDaChon === 5 ? "bg-pink-400 text-white" : ""
                                            }`}                                        
                                        >
                                            5 Sao ({soLuongDanhGiaTungSao[4]})
                                        </button>
                                        <button
                                            onClick={() => locDanhGia(4)}
                                            className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 shadow w-full ${
                                                soSaoDaChon === 4 ? "bg-pink-400 text-white" : ""
                                            }`}                                        
                                        >
                                            4 Sao ({soLuongDanhGiaTungSao[3]})
                                        </button>
                                        <button
                                            onClick={() => locDanhGia(3)}
                                            className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 shadow w-full ${
                                                soSaoDaChon === 3 ? "bg-pink-400 text-white" : "" 
                                            }`}                                        
                                        >
                                        3 Sao ({soLuongDanhGiaTungSao[2]})
                                        </button>
                                        <button
                                            onClick={() => locDanhGia(2)}
                                            className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 shadow w-full ${
                                            soSaoDaChon === 2 ? "bg-pink-400 text-white" : ""
                                            }`}                                        
                                        >
                                            2 Sao ({soLuongDanhGiaTungSao[1]})
                                        </button>
                                        <button
                                            onClick={() => locDanhGia(1)}
                                            className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 shadow w-full ${
                                            soSaoDaChon === 1 ? "bg-pink-400 text-white" : ""
                                            }`}                                        
                                        >
                                            1 Sao ({soLuongDanhGiaTungSao[0]})
                                        </button>

                                    </div>
                                </div>
                                <div>
                                {dsDanhGiaLoc && dsDanhGiaLoc.length > 0 ? (
                                    dsDanhGiaLoc.map(danhGia => (
                                        <div key={danhGia._id} className='flex bg-pink-100 mb-5 shadow-lg rounded-md p-3'>
                                            <img
                                                src={danhGia?.idNguoiDungDG?.anhND || 'https://placehold.co/60x60/FF69B4/FFFFFF'}
                                                alt={danhGia?.idNguoiDungDG?.tenNguoiDung || 'Người dùng image'}
                                                className="w-10 h-10 object-cover rounded-full mr-3"
                                            />
                                            <div>
                                                <p className='font-bold'>{danhGia?.idNguoiDungDG?.tenNguoiDung}</p>
                                                <p className='text-xs mb-2'>{moment(danhGia.ngayDanhGia).format('YYYY-MM-DD hh:mm')}</p>
                                                <div className="flex">
                                                    {[1,2,3,4,5].map((star) => {
                                                        if (star <= Math.floor(danhGia.soSao)) {
                                                            return <FaStar key={star} size={15} className="text-yellow-500 mr-1" />;
                                                        } else {
                                                            return <FaRegStar key={star} size={15} className="text-gray-300 mr-1" />;
                                                        }
                                                    })}
                                                </div>
                                                <p className='mt-2'>{danhGia.noiDung}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có đánh giá nào.</p>
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-10 pr-12">
                    <div className="w-auto flex items-center justify-end mb-3">
                        <div
                            onClick={toggleFavorite}
                            className={`cursor-pointer ${
                                isFavorite ? "text-red-500" : "text-gray-500"
                            } transition duration-200`}
                        >
                            {isFavorite ? <IoIosHeart size={20} /> : <IoIosHeartEmpty size={20} />}
                        </div>
                        <div className='px-2 h-9 flex justify-center items-center text-lg border ml-2'>
                            {favoriteCount}
                        </div>
                        <div className='px-2 h-9 flex justify-center items-center text-lg border ml-2'>
                            <GoShareAndroid/>
                        </div>
                        <div className='px-2 h-9 flex justify-center items-center text-lg border ml-2'>
                            <HiOutlineDotsHorizontal/>
                        </div>
                    </div>
                    <div className="items-center border p-7 w-96">
                        <div>
                            <div className="flex justify-between mt-4">
                                <button
                                    className={`px-4 py-2 ${selectedPackage === 'coban' ? 'bg-pink-600 text-white' : 'bg-pink-100'} `}
                                    onClick={() => handlePackageChange('coban')}
                                >
                                    CƠ BẢN
                                </button>
                                <button
                                    className={`px-4 py-2 ${selectedPackage === 'thuong' ? 'bg-pink-600 text-white' : 'bg-pink-100'} `}
                                    onClick={() => handlePackageChange('thuong')}
                                >
                                    THƯỜNG
                                </button>
                                <button
                                    className={`px-4 py-2 ${selectedPackage === 'nangcao' ? 'bg-pink-600 text-white' : 'bg-pink-100'} `}
                                    onClick={() => handlePackageChange('nangcao')}
                                >
                                    NÂNG CAO
                                </button>
                            </div>
                            <div className="mt-4">
                                <div className='flex justify-between mt-7 mb-7'>
                                    <p className='text-xl w-2/3 font-bold'>{dichvu.phanLoai?.[selectedPackage]?.tenLoai}</p>
                                    <p className="text-lg ">
                                        {dichvu.phanLoai?.[selectedPackage]?.giaLoai?.toLocaleString()} đ
                                    </p>
                                </div>
                                <p className="text-gray-800 mt-3">{dichvu.phanLoai?.[selectedPackage]?.moTaLoai}</p>
                                <p className="text-gray-600 mt-7 flex items-center">
                                    <FaRegClock className='mr-2'/> {dichvu.phanLoai?.[selectedPackage]?.thoiGianDuKien}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="giohang_button mt-3 px-4 py-2 bg-pink-600 text-white rounded w-80"
                        >
                            THÊM VÀO GIỎ HÀNG
                        </button>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-pink-100 text-gray-800 rounded w-full">
                        Liên hệ với tôi
                        <i className="fas fa-chevron-down">
                        </i>
                    </button>
                    
                    {authUser !== dichvu.idNguoiDungDV && <ChatBubble id={id} />}
                </div>
            </div>
            {hienthiGiohang && (
                <GioHang/>
            )}
        </div>
    );
}

export default DichVuDetail;
