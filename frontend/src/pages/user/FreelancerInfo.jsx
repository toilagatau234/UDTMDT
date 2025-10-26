import { useState } from "react";
import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";
import axios from "axios";

function FreelancerInfo() {
    const [diaChi, setDiaChi] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!diaChi || !soDienThoai) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(soDienThoai)) {
            setError("Số điện thoại không hợp lệ.");
            return;
        }

        try {
            await axios.post("/api/user/form", { soDienThoai, diaChi });

            setSuccess("Thông tin đã được lưu thành công!");
            setError("");
        } catch (err) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div id="Header">
                <Header />
            </div>
            <div id="CategoriesMenu">
                <CategoriesMenu />
            </div>
            <div className="content p-8">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Cập nhật Thông tin Freelancer</h2>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {success && <div className="text-green-500 mb-4">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="diaChi" className="block text-gray-700 font-semibold mb-2">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                id="diaChi"
                                value={diaChi}
                                onChange={(e) => setDiaChi(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Nhập địa chỉ của bạn"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="soDienThoai" className="block text-gray-700 font-semibold mb-2">
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                id="soDienThoai"
                                value={soDienThoai}
                                onChange={(e) => setSoDienThoai(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Nhập số điện thoại của bạn"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none"
                        >
                            Lưu thông tin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FreelancerInfo;
