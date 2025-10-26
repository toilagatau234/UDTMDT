import CategoriesMenu from "../../components/user/CategoriesMenu";
import Header from "../../components/user/Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function QuanLyDichVu_Add() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tenDichVu: '',
        moTaDV: '',
        kyNang: [],
        trangThaiDV: '',
        idDanhMucDV: '',
        phanLoai: {
            coban: { tenLoai: '', giaLoai: '', moTaLoai: '', thoiGianDuKien: '' },
            thuong: { tenLoai: '', giaLoai: '', moTaLoai: '', thoiGianDuKien: '' },
            nangcao: { tenLoai: '', giaLoai: '', moTaLoai: '', thoiGianDuKien: '' }
        },
        anhDichVu: '',
    });
    const [categories, setCategories] = useState([]);
    const [coverImage, setCoverImage] = useState(null); 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/danhmuc');
                const categoryNames = response.data.map(category => ({
                    id: category._id,
                    name: category.tenDM,
                }));
                setCategories(categoryNames); 
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePackageChange = (e, packageType) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            phanLoai: {
                ...prevData.phanLoai,
                [packageType]: {
                    ...prevData.phanLoai[packageType],
                    [name]: value
                }
            }
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];  
        if (file) {
            const reader = new FileReader(); 
            reader.onloadend = () => {
                setCoverImage(reader.result);  
                setFormData((prevData) => ({
                    ...prevData,
                    anhDichVu: reader.result,  
                }));
            };
            reader.readAsDataURL(file);  
            }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await axios.post('/api/dichvu/them', formData);
            if (response.status === 201) {
                alert("Thêm thành công!");
                navigate('/user/quanlydichvu/list');
            } else {
                alert("Có lỗi xảy ra khi thêm dịch vụ, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi thêm dịch vụ:", error);
            alert("Lỗi khi thêm dịch vụ: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br min-h-screen">
            <div id="Header" className="mb-6">
                <Header />
            </div>
            <div id="CategoriesMenu" className="mb-6">
                <CategoriesMenu />
            </div>
            <div className="content bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Thêm dịch vụ</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Tên Dịch Vụ</label>
                        <input
                            type="text"
                            name="tenDichVu"
                            value={formData.tenDichVu}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Mô tả dịch vụ</label>
                        <textarea
                            name="moTaDV"
                            value={formData.moTaDV}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            required
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Kỹ Năng (nhập các kỹ năng, cách nhau bằng dấu phẩy):
                        </label>
                        <input
                            type="text"
                            value={formData.kyNang.join(';')}
                            onChange={(e) => {
                                const newSkills = e.target.value.split(';').map((k) => k);
                                setFormData((prevData) => ({
                                    ...prevData,
                                    kyNang: newSkills
                                }));
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Danh Mục</label>
                        <select
                            name="idDanhMucDV"
                            value={formData.idDanhMucDV}
                            onChange={handleChange}
                            className="uppercase w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id} className="uppercase ">
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Trạng thái</label>
                        <select
                            name="trangThaiDV"
                            value={formData.trangThaiDV}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            required
                        >
                            <option value="">Chọn</option>
                            <option value="Công khai">Công khai</option>
                            <option value="Riêng tư">Riêng tư</option>
                            <option value="Khóa">Khóa</option>
                        </select>
                    </div>

                    {/* Inputs for each package */}
                    {['coban', 'thuong', 'nangcao'].map((packageType, index) => (
                        <div key={packageType} className="mt-8 bg-gray-100 p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800">{`Gói ${index + 1}`} </h3>
                            <div>
                                <label className="block text-md font-medium text-gray-700 mt-4">Tên gói</label>
                                <input
                                    type="text"
                                    name="tenLoai"
                                    value={formData.phanLoai[packageType].tenLoai}
                                    onChange={(e) => handlePackageChange(e, packageType)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-md font-medium text-gray-700 mt-4">Giá gói</label>
                                <input
                                    type="number"
                                    name="giaLoai"
                                    value={formData.phanLoai[packageType].giaLoai}
                                    onChange={(e) => handlePackageChange(e, packageType)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-md font-medium text-gray-700 mt-4">Mô tả gói</label>
                                <textarea
                                    name="moTaLoai"
                                    value={formData.phanLoai[packageType].moTaLoai}
                                    onChange={(e) => handlePackageChange(e, packageType)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-md font-medium text-gray-700 mt-4">Thời gian hoàn thành</label>
                                <input
                                    type="text"
                                    name="thoiGianDuKien"
                                    value={formData.phanLoai[packageType].thoiGianDuKien}
                                    onChange={(e) => handlePackageChange(e, packageType)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    <div className="mt-8">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Chọn ảnh đại diện dịch vụ</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full px-4 py-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                        {coverImage && (
                            <img src={coverImage} alt="Cover Preview" className="mt-4 max-w-xs rounded-lg shadow-md" />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-6 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                        Thêm dịch vụ
                    </button>
                </form>
            </div>
        </div>
    );
}

export default QuanLyDichVu_Add;
