import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const PaymentResult = () => {
    const donhangId = Cookies.get('donhangId');
    const [giaodich, setGiaodich] = useState(null);
    const [countdown, setCountdown] = useState(30);
    const navigate = useNavigate();

    useEffect(() => {
        if (donhangId) {
            const fetchGiaoDichData = async () => {
                try {
                    const response = await Axios.get(`/api/donhang/laygiaodichtheoid/${donhangId}`);
                    console.log("Dữ liệu giao dịch: ", response.data);
                    setGiaodich(response.data);
                } catch (err) {
                    console.error('Lỗi khi tải giao dịch:', err);
                    navigate('/');
                }
            };

            fetchGiaoDichData();

            setCountdown(30);
        } else {
            navigate('/');
        }
    }, [donhangId, navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            navigate('/');
        }
    }, [countdown, navigate]);

    if (!giaodich) {
        return (
            <div className='flex items-center justify-center w-screen h-screen'>
                <div className='bg-red-50 p-5 rounded-lg shadow-xl'>
                    <p>Không có giao dịch.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center w-screen h-screen'>
            {/* Kiểm tra trạng thái thanh toán và hiển thị thông tin */}
            {giaodich.giaoDich.trangThaiThanhToan === "Thất bại" ? (
                <div className='bg-red-50 p-5 rounded-lg shadow-xl'>
                    <FaCircleXmark className='text-6xl text-red-600 m-auto mb-3' />
                    <p className="flex justify-center items-center">Thanh toán thất bại!</p>
                    {giaodich.giaoDich && (
                        <>
                            <p><strong>Số tiền:</strong> {giaodich.tongTien.toLocaleString('vi-VN')}</p>
                            <p><strong>Mã đơn hàng:</strong> {giaodich.giaoDich.maGiaoDich}</p>
                            <p><strong>Thời gian:</strong> {moment(giaodich.giaoDich.createdAt).format('YYYY-MM-DD hh:mm A')} </p>
                            <p><strong>Phương thức thanh toán:</strong> {giaodich.giaoDich.loaiGiaoDich} ({giaodich.giaoDich.loaiThe})</p>
                        </>
                    )}
                    <p className="text-xs">Thời gian còn lại: {countdown} giây</p>
                    <div
                        onClick={() => navigate('/')}
                        className="cursor-pointer p-3 bg-red-500 text-white rounded-md hover:bg-red-600 active:scale-95 transition duration-200 flex items-center justify-center text-center"
                        >
                        Đóng
                    </div>
                </div>
            ) : giaodich.giaoDich.trangThaiThanhToan === "Thành công" ? (
                <div className='bg-green-50 p-5 rounded-lg shadow-xl'>
                    <FaCheckCircle className='text-6xl text-green-600 m-auto mb-3' />
                    <p className="flex justify-center items-center">Thanh toán thành công!</p>
                    {giaodich.giaoDich && (
                        <>
                            <p><strong>Số tiền:</strong> {giaodich.tongTien.toLocaleString('vi-VN')}</p>
                            <p><strong>Mã đơn hàng:</strong> {giaodich.giaoDich.maGiaoDich}</p>
                            <p><strong>Thời gian:</strong> {moment(giaodich.giaoDich.createdAt).format('YYYY-MM-DD hh:mm A')} </p>
                            <p><strong>Phương thức thanh toán:</strong> {giaodich.giaoDich.loaiGiaoDich} ({giaodich.giaoDich.loaiThe})</p>
                        </>
                    )}
                    <p className="text-sm">Thời gian còn lại: {countdown} giây</p>
                    <div
                        onClick={() => navigate('/')}
                        className="cursor-pointer p-3 bg-green-500 text-white rounded-md hover:bg-green-600 active:scale-95 transition duration-200 flex items-center justify-center text-center"
                        >
                        Đóng
                    </div>
                </div>
            ) : (
                <div className='bg-gray-50 p-5 rounded-lg shadow-xl'>
                    <p>Không có giao dịch.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentResult;
