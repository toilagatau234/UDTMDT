import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";
import Sidebar from "../../components/user/Sidebar";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"; 
import axios from 'axios';


function QuanLyDichVu() {
    const [dichvus, setDichvus] = useState([]);

    useEffect(() => {
        const fetchDichvus = async () => {
            try {
                const response = await axios.get('/api/dichvu/theonguoidung');
                setDichvus(response.data);
            } catch (error) {
                console.error("There was an error fetching the services:", error);
            }
        };

        fetchDichvus();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/dichvu/${id}`);
            setDichvus(dichvus.filter(dichvu => dichvu._id !== id));
        } catch (error) {
            console.error("There was an error deleting the service:", error);
        }
    };
    
    return (
        <div className='container  mx-auto px-4'> 
            <div id="Header" className="mb-6">
                <Header />
            </div>
            <div id="CategoriesMenu"  className="mb-8">
                <CategoriesMenu />
            </div>
            <div className='content p-8 flex'> 
                <div className="profile-sidebar bg-pink-300 w-1/4 p-6 rounded-lg shadow-md">
                    <Sidebar />
                </div>
                <div className="profile-content w-3/4 ml-8 p-5 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-semibold text-gray-600 ">Danh sách dịch vụ</p>
                        <Link to={'/user/quanlydichvu/list/add'}>
                            <div className="bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold py-2 px-4 rounded-lg shadow">
                                Thêm dịch vụ
                            </div>
                        </Link>
                    </div>
                    <div className="rounded-lg overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-pink-200 text-gray-600 uppercase text-sm leading-normal shadow">
                                    <th className="py-3 px-6 text-left">Tên</th>
                                    <th className="py-3 px-6 text-left">Trạng thái</th>
                                    <th className="py-3 px-6 text-left">Ngày cập nhật</th>
                                    <th className="py-3 px-6 text-left"></th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                                {dichvus.map((dichvu) => (
                                        <tr key={dichvu._id} className="border-b border-gray-200 hover:bg-gray-100 ">
                                            <td className="py-3 px-6 text-left w-1/2">{dichvu.tenDichVu}</td>
                                            <td className="py-3 px-6 text-left">{dichvu.trangThaiDV}</td>
                                            <td className="py-3 px-6 text-left">{new Date(dichvu.updatedAt).toLocaleDateString()}</td>
                                            <th className="py-3 px-6 text-left">
                                                <div className="flex flex-col text-center">
                                                    <Link to={`/user/quanlydichvu/list/${dichvu._id}/edit`}>
                                                        <FaRegEdit 
                                                            className="cursor-pointer text-blue-500 hover:text-blue-700" 
                                                        />
                                                    </Link>
                                                    <AiOutlineDelete 
                                                        className="cursor-pointer text-red-500 hover:text-red-700" 
                                                        onClick={() => handleDelete(dichvu._id)} 
                                                    />
                                                </div>
                                            </th>
                                        </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuanLyDichVu;
