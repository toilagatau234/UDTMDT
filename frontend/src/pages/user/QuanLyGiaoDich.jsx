import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";
import Sidebar from "../../components/user/Sidebar";
import { BiLeftDownArrowCircle, BiRightTopArrowCircle } from "react-icons/bi";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';

function QuanLyGiaoDich() {
    const [giaoDich, setGiaoDich] = useState([]);
    const [soDu, setSoDu] = useState();

    useEffect(() => {
        const fetchGiaoDichData = async () => {
            try {
                const response = await axios.get(`/api/user/lay/giaodich`);
                setGiaoDich(response.data.danhSachGiaoDich);      
                setSoDu(response.data.tongTien);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu giao dịch:", error);
            }
        };
        fetchGiaoDichData();
    }, []);

    const capNhatSoDu = async () => {
        try {
            const giaoDich = {
                soTienGiaoDich: soDu,
                dongTien: 'Trừ',
                noiDungGiaoDich: "Rút tiền",
            };
            await axios.patch('/api/user/capnhat/sodu/ruttien', giaoDich);
            alert("Rút tiền thành công!");
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật số dư:", error);
            return false;
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
                    <div className="flex justify-between">
                        <div>
                            <p className="mb-1 text-base px-7">Số dư tài khoản</p>
                            <p className="text-lg px-7"><span className="mr-3 text-4xl">{soDu?.toLocaleString() || 'N/A'}</span>VND</p>
                        </div>
                        <div 
                            onClick={capNhatSoDu}
                            className="bg-pink-200 font-bold flex items-center px-10 shadow-md hover:bg-pink-400 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                            Rút tiền
                        </div>
                    </div>
                    <div className="bg-pink-50 mt-4 px-7 py-5">
                        <p className="font-semibold mb-5 text-xl">Truy vấn giao dịch</p>
                        {giaoDich.length === 0 ? (
                            <div className="text-center text-gray-600 text-lg font-medium">
                                Chưa có giao dịch nào.
                            </div>
                        ) : (
                            giaoDich.map((gd, index) => (
                                <div key={index} className="bg-white mt-5 shadow-md">
                                    <p className="bg-pink-100 px-3 py-2">
                                        {moment(gd.ngayGiaoDich).format('DD/MM/YYYY')}
                                    </p>
                                    <div className="flex px-3 py-2 items-center">
                                        <div className="mr-2">
                                            {gd.dongTien === 'Cộng' ? <BiLeftDownArrowCircle/> : <BiRightTopArrowCircle/>}
                                        </div>
                                        <div className="w-full">
                                            <span className="flex justify-between">
                                                <p className="uppercase text-sm">Tiền {gd.dongTien === 'Cộng' ? 'vào' : 'ra'}</p>
                                                <p className="font-bold">{gd.dongTien === 'Cộng' ? `+${gd.soTienGiaoDich.toLocaleString()}` : `-${gd.soTienGiaoDich.toLocaleString()}`} VND</p>
                                            </span>
                                            <span className="flex justify-between">
                                                <p>{gd.noiDungGiaoDich}</p>
                                                <p className="text-pink-600">{moment(gd.ngayGiaoDich).format('HH:mm')}</p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuanLyGiaoDich;
