import { useEffect, useState } from 'react';
import Axios from 'axios';
import { FaRegClock } from "react-icons/fa";


export default function GioHang() {
    const [giohang, setGiohang] = useState(null);
    const [dichvu, setDichvu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGioHangData();
    }, []);

    const fetchGioHangData = async () => {
        try {
            const response = await Axios.get(`/api/giohang`);
            setGiohang(response.data);
            if (response.data) {
                fetchDichVuDetails(response.data.dichVu.dichVuId);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchDichVuDetails = async (id) => {
        try {
            const response = await Axios.get(`/api/dichvu/lay/${id}`);
            setDichvu(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi tải dịch vụ:", error);
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            const giaoDich = {
                dichVuId: giohang.dichVu.dichVuId,
                soLuong: giohang.dichVu.soLuong,
                phanLoai: {
                    tenLoai: giohang.dichVu.phanLoai.tenLoai,
                    giaLoai: giohang.dichVu.phanLoai.giaLoai,
                    moTaLoai: giohang.dichVu.phanLoai.moTaLoai,
                    thoiGianDuKien: giohang.dichVu.phanLoai.thoiGianDuKien,
                },
                tongTien: tong(),
            };
    
            const orderResponse = await Axios.post('/api/donhang/themdonhang', giaoDich);
            if (orderResponse.status === 201) {
    
                const donhangId = orderResponse.data.donhangId; 
                console.log('donhangId:', donhangId);
                alert(`Thêm thành công! DonhangId: ${donhangId}`);
    
                const newPayment = {
                    amount: tong(),
                    bankCode: null,
                    language: "vn",
                    donhangId: donhangId,
                };
    
                const paymentResponse = await Axios.post('/api/vnpay/create_payment_url', newPayment);
                if (paymentResponse.status === 200 && paymentResponse.data) {
                    window.location.href = paymentResponse.data;
                }
            } else {
                alert("Có lỗi xảy ra khi thêm dịch vụ, vui lòng thử lại.");
            }
        } catch (error) {
            console.error('Lỗi khi thêm đơn hàng:', error);
            alert(`Lỗi: ${error?.message}`);
        }
    };

    const capNhatSoLuong = async (soLuongMoi) => {
        try {
            const response = await Axios.put('/api/giohang/capnhat', {
                dichVuId: giohang.dichVu.dichVuId,
                soLuong: soLuongMoi,
            });
            setGiohang(response.data);
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    const congSoLuong = () => {
        if (giohang.dichVu.soLuong < 99) {
            capNhatSoLuong(giohang.dichVu.soLuong + 1);
        }
    };

    const truSoLuong = () => {
        if (giohang.dichVu.soLuong > 1) {
            capNhatSoLuong(giohang.dichVu.soLuong - 1);
        }
    };

    const tong = () => {
        return giohang.dichVu.soLuong * giohang.dichVu.phanLoai.giaLoai;
    };

    if (loading) {
        return <div className="text-center text-lg font-semibold">Đang tải dữ liệu giỏ hàng...</div>;
    }

    return (
        <div id='giohang' className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-xl rounded-lg">
            <header className='flex justify-between items-center pt-5 pr-10 pl-10 border-b-2 border-gray-200 pb-4'>
                <h3 className='text-xl font-bold text-gray-800'>
                    GIỎ HÀNG
                </h3>
            </header>
            {giohang ? (
                <div className='space-y-4 pt-10 pr-5 pl-5'>
                    {dichvu ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold text-gray-800 capitalize">{giohang.dichVu.phanLoai.tenLoai}</div>
                                <div className="text-sm text-gray-600">{giohang.dichVu.phanLoai.giaLoai.toLocaleString()} đ</div>
                            </div>
                            <div>{giohang.dichVu.phanLoai.moTaLoai}</div>
                            <div className='flex items-center'><FaRegClock className='mr-2'/> {giohang.dichVu.phanLoai.thoiGianDuKien}</div>
                            <div className="flex justify-between items-center border-t border-gray-300 pt-4">
                                <p className='text-sm'>Số lượng dịch vụ</p>
                                <div className="text-lg text-gray-700">
                                    <button onClick={truSoLuong} className="border border-pink-400 px-3 py-1 w-10 h-10 rounded-full hover:bg-pink-300">
                                        -
                                    </button>
                                    <span className="mx-3">{giohang.dichVu.soLuong}</span>
                                    <button onClick={congSoLuong} className="border border-pink-400 px-3 py-1 w-10 h-10 rounded-full hover:bg-pink-200">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-lg font-semibold mt-4 ">
                                <span>Tổng:</span>
                                <span>{tong().toLocaleString()} đ</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-lg text-gray-600">Không tìm thấy dịch vụ.</p>
                    )}
                </div>
            ) : (
                <p className="text-center text-lg text-gray-600">Giỏ hàng của bạn trống.</p>
            )}
            <div className="mt-4 flex justify-between items-center pr-5 pl-5">
                <button className="w-full py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600" onClick={handlePayment}>
                    THANH TOÁN
                </button>
            </div>
        </div>
    );
}
