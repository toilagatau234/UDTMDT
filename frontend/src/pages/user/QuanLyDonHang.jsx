import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";
import Sidebar from "../../components/user/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';

function QuanLyDonHang() {
    const [donhang, setDonhang] = useState([]);
    const [trangThaiDH, setTrangThaiDH] = useState("Chờ xác nhận")
    const [hienThiChiTiet, setHienThiChiTiet] = useState(false);
    const [chiTietDonHang, setChiTietDonHang] = useState(null);

    const [hienThiDanhGia, setHienThiDanhGia] = useState(false);
    const [donHangDanhGia, setDonHangDanhGia] = useState(null);
    const [chonSao, setChonSao] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchDonhangData(trangThaiDH);
    }, [trangThaiDH]);

    const fetchDonhangData = async (trangThaiDH) => {
        try {
            setDonhang([]);

            const response = await axios.get(`/api/donhang/laydonhangcuanguoimua/${trangThaiDH}`);
            setDonhang(response.data);      
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
        }
    };

    const handleTrangThaiChange = (status) => {
        setTrangThaiDH(status);
    };

    const handleCapNhatTrangThaiChange = async (id, newStatus) => {
        try {
            await axios.patch(`/api/donhang/capnhattrangthai/${id}`, { trangThaiDH: newStatus });
            fetchDonhangData(trangThaiDH);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        }
    };

    const xulyXemChiTiet = (donhang) => {
        setChiTietDonHang(donhang);
        setHienThiChiTiet(prev => !prev);
    };

    const capNhatSoDu = async (giaoDich) => {
        try {
            await axios.patch('/api/user/capnhat/sodu', giaoDich);
        } catch (error) {
            console.error("Lỗi khi cập nhật số dư:", error);
            return false;
        }
    };

    const huyDanhGia = async () => {
        setHienThiDanhGia(false);
        setChonSao(0);
        setComment('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!chonSao || !comment) {
            alert('Vui lòng chọn số sao và nhập nhận xét.');
            return;
        }

        try {
            await axios.patch(`/api/dichvu/capnhat/danhgia/${donHangDanhGia.dichVuId._id}`, {
                donHangId: donHangDanhGia._id,
                soSao: chonSao,
                noiDung: comment,
            });
            alert('Đánh giá thành công');
            setHienThiDanhGia(false);
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };


    return (
        <div className="container mx-auto px-4">
            <div id="Header" className="mb-6">
                <Header />
            </div>
            <div id="CategoriesMenu" className="mb-8">
                <CategoriesMenu />
            </div>
            <div className="content p-8 flex">
                <div className="profile-sidebar bg-pink-300 w-1/4 p-6 rounded-lg shadow-md">
                    <Sidebar />
                </div>
                <div className="profile-content w-3/4 ml-8 p-5 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        {["Chờ xác nhận", "Đã xác nhận", "Đã hoàn thành", "Đã kết thúc"].map((status) => (
                            <button
                                key={status}
                                className={`bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 shadow w-full ${
                                    trangThaiDH === status ? "bg-pink-400 text-white" : ""
                                }`}
                                onClick={() => handleTrangThaiChange(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    {donhang.length === 0 ? (
                        <div className="text-center text-gray-600 py-4">
                            <p>Chưa có đơn hàng</p>
                        </div>
                    ) : (
                        <div className="rounded-lg overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow-md table-auto">
                                <thead>
                                    <tr className="bg-pink-200 text-gray-600 text-sm leading-normal shadow">
                                        <th className="py-3 px-6 text-center w-1/12">stt</th>
                                        <th className="py-3 px-6 text-center w-1/6">Thời gian</th>
                                        <th className="py-3 px-6 text-center w-1/12">Người bán</th>
                                        <th className="py-3 px-6 text-center w-1/3">Dịch vụ</th>
                                        <th className="py-3 px-6 text-center w-1/6">Tên loại</th>
                                        <th className="py-3 px-6 text-center w-1/2"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm font-light">
                                    {donhang.map((donhang, index) => (
                                        <tr key={donhang._id} className="donhang_button border-b border-gray-200 hover:bg-gray-100" onClick={() => xulyXemChiTiet(donhang)}>
                                            <td className="py-3 px-6 text-center">{index+1}</td>
                                            <td className="py-3 px-6 text-center">{moment(donhang.updatedAt).format('YYYY-MM-DD hh:mm')}</td>
                                            <td className="py-3 px-6 text-center">{donhang.nguoiBanId?.tenNguoiDung}</td>
                                            <td className="py-3 px-6 text-left">{donhang.dichVuId?.tenDichVu}</td>
                                            <td className="py-3 px-6 text-center">{donhang.phanLoai?.tenLoai}</td>
                                            <td className="py-3 px-6 text-center">
                                            {(donhang.trangThaiDH === "Chờ xác nhận") && (
                                                <span className="text-gray-400">Chờ xác nhận</span>
                                            )}
                                            {(donhang.trangThaiDH === "Đã xác nhận") && (
                                                <span className="text-gray-400">Đang thực hiện</span>
                                            )}
                                            {donhang.trangThaiDH === "Đã hoàn thành" && (
                                                <button
                                                    className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-semibold py-1 px-3 rounded-lg shadow"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                            
                                                        try {
                                                            await handleCapNhatTrangThaiChange(donhang._id, "Đã kết thúc");
                                            
                                                            const giaoDich = {
                                                                nguoiGiaoDich: donhang.khachHangId,
                                                                soTienGiaoDich: donhang.tongTien,
                                                                dongTien: 'Cộng',
                                                                noiDungGiaoDich: "Hoàn thành đơn hàng: " + donhang._id,
                                                                idNguoiBan: donhang.nguoiBanId,
                                                            };
                                            
                                                            await capNhatSoDu(giaoDich);
                                                            alert("Đơn hàng đã được hoàn thành và số dư đã được cập nhật.");
                                                        } catch (error) {
                                                            console.error("Lỗi khi cập nhật trạng thái đơn hàng hoặc số dư:", error);
                                                            alert("Đã xảy ra lỗi. Vui lòng thử lại.");
                                                        }
                                                    }}
                                                >
                                                    Đã nhận sản phẩm
                                                </button>
                                            )}

                                            {(donhang.trangThaiDH === "Đã kết thúc") && (!donhang.danhGia) && (
                                                <button
                                                    className="text-xs border border-pink-300 text-yellow-800 font-semibold py-1 px-3 rounded-lg shadow"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDonHangDanhGia(donhang);
                                                        setHienThiDanhGia(true);
                                                    }}
                                                >
                                                    Đánh giá
                                                </button>
                                            )}

                                            {(donhang.trangThaiDH === "Đã kết thúc") && (donhang.danhGia) && (
                                                <span className="text-gray-400">Đã đánh giá</span>
                                            )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {hienThiChiTiet && chiTietDonHang && (
                    <div id="Chitiet" className="absolute bg-white border rounded shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-1/2 max-h-96 overflow-y-auto">
                        <h2 className="font-semibold text-lg mb-4">Chi tiết đơn hàng</h2>
                        <p>{chiTietDonHang.nguoiBanId?.tenNguoiDung}</p>
                        <p><strong>Danh mục:</strong> {chiTietDonHang.dichVuId?.idDanhMucDV?.tenDM}</p>
                        <p><strong>Dịch vụ:</strong> {chiTietDonHang.dichVuId?.tenDichVu}</p>
                        <p><strong>Thời gian đặt:</strong> {moment(chiTietDonHang.createdAt).format('YYYY-MM-DD hh:mm')}</p>
                        <p><strong>Loại dịch vụ:</strong> {chiTietDonHang.phanLoai?.tenLoai}</p>
                        <p><strong>Số lượng:</strong> {chiTietDonHang.soLuong}</p>
                        <p><strong>Tổng tiền:</strong> {chiTietDonHang.tongTien ? chiTietDonHang.tongTien.toLocaleString('vi-VN') : 'Chưa có'}</p>
                        
                        <button
                            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow"
                            onClick={() => setHienThiChiTiet(false)}
                        >
                            Đóng
                        </button>
                    </div>
                )}

                {hienThiDanhGia && donHangDanhGia && (
                    <div id="DanhGia" className="absolute bg-white border rounded shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-1/2 max-h-96 overflow-y-auto">
                        <h2 className="font-semibold text-lg mb-4 flex items-center">Đánh giá đơn hàng</h2>
                        <p><strong>Dịch vụ:</strong> {donHangDanhGia.dichVuId?.tenDichVu}</p>
                        <p><strong>Người bán:</strong> {donHangDanhGia.nguoiBanId?.tenNguoiDung}</p>
                        
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Số sao:</label>
                                <div className="flex items-center mb-4">
                                    {[1, 2, 3, 4, 5].map((sao) => (
                                    <button
                                        key={sao}
                                        onClick={() => setChonSao(sao)}
                                        className={`text-3xl ${sao <= chonSao ? "text-yellow-500" : "text-gray-300"}`}
                                    >
                                        ★
                                    </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2">Nội dung đánh giá:</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2 mb-4"
                                    rows="4"
                                    placeholder="Nhập nhận xét của bạn..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                            </div>
                            <div className="flex justify-end">
                                
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow mr-2"
                                    onClick={huyDanhGia}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
                                    onClick={handleSubmit}
                                >
                                    Gửi đánh giá
                                </button>
                            </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default QuanLyDonHang;
