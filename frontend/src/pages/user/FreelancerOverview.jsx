import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import CategoriesMenu from "../../components/user/CategoriesMenu";

function FreelancerOverview() {
    const [isAccepted, setIsAccepted] = useState(false);
    const navigate = useNavigate();

    const handleAcceptTerms = () => {
        if (isAccepted) {
            navigate("/freelancer/info");
        } else {
            alert("Vui lòng chấp nhận điều lệ trước khi tiếp tục.");
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
                    <h2 className="text-2xl font-semibold mb-4">Điều lệ Freelancer</h2>
                    <p className="mb-4">
                        Đây là điều lệ dành cho các freelancer. Bạn cần đọc kỹ và chấp nhận trước khi tiếp tục.
                    </p>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">1. Quy định và Điều kiện</h3>
                        <p className="text-gray-700">
                            Bạn phải tuân thủ tất cả các quy định trong quá trình cung cấp dịch vụ trên nền tảng. Việc vi phạm các quy định có thể dẫn đến việc khóa tài khoản của bạn.
                        </p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">2. Chính sách thanh toán</h3>
                        <p className="text-gray-700">
                            Chúng tôi sẽ thanh toán cho bạn theo các phương thức đã được thỏa thuận trước đó. Bạn có trách nhiệm đảm bảo rằng thông tin thanh toán của mình là chính xác.
                        </p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">3. Quyền và nghĩa vụ của bạn</h3>
                        <p className="text-gray-700">
                            Bạn có quyền cung cấp các dịch vụ của mình, nhưng bạn cũng có nghĩa vụ hoàn thành công việc đúng thời gian và chất lượng yêu cầu.
                        </p>
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            checked={isAccepted}
                            onChange={(e) => setIsAccepted(e.target.checked)}
                            className="h-5 w-5 text-pink-600 border-gray-300 rounded"
                        />
                        <label htmlFor="accept-terms" className="ml-2 text-gray-700">
                            Tôi đã đọc và chấp nhận các điều lệ
                        </label>
                    </div>

                    <button
                        onClick={handleAcceptTerms}
                        className={`px-6 py-3 mt-4 rounded-lg text-white ${
                            isAccepted ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isAccepted}
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FreelancerOverview;
