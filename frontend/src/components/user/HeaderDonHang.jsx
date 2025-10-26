import { useState, useEffect } from 'react';
import axios from 'axios';

function HeaderDonHang() {
    const [soLuongDonHang, setSoLuongDonHang] = useState(0);
    const [donHang, setDonHang] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonHang = async () => {
            try {
                const response = await axios.get('/api/donhang/lay/tatca/donhang/nguoimua');
                setDonHang(response.data.gioHang);
                setSoLuongDonHang(response.data.soLuongDonHang);
            } catch (error) {
                console.error('Lỗi khi lấy đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonHang();
    }, []);

    return (
        <div id="Donhang" className="absolute right-5 w-64 bg-white border rounded shadow-lg z-50">
            <div className="border-b px-4 py-2">
                <h2 className="text-lg font-semibold">Đơn hàng ({soLuongDonHang})</h2>
            </div>
            <div className="p-4 flex items-start justify-center space-x-4">
                {loading ? (
                    <p className="text-sm text-gray-700">Đang tải...</p>
                ) : donHang.length === 0 ? (
                    <p className="text-sm text-gray-700">Chưa có đơn hàng nào</p>
                ) : (
                    <ul className="space-y-2">
                        {donHang.map((item) => (
                            <li key={item._id} className="text-sm text-gray-700">
                                <p>{item.dichVuId?.tenDichVu} - {item.trangThaiDH}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default HeaderDonHang;
