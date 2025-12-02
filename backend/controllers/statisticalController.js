const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/OrderProduct'); 

const getDashboardStats = async (req, res) => {
    try {
        // Đếm tổng số lượng
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } }); // Không tính admin
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Tính tổng doanh thu (Chỉ tính các đơn hàng đã thanh toán hoặc đã giao)
        // Lưu ý: Bạn cần kiểm tra lại field 'totalPrice' và 'status' trong Model Order của bạn có đúng tên không
        const revenueStats = await Order.aggregate([
            { 
                $match: { 
                    // SỬA Ở ĐÂY: Tính doanh thu nếu Đã thanh toán (isPaid=true) HOẶC Đã giao thành công
                    // Điều này bao gồm: 
                    // 1. VNPay (isPaid: true ngay từ đầu)
                    // 2. COD sau khi Admin set Delivered (lúc này isPaid sẽ bật lên true nhờ code ở bước 2)
                    $or: [
                        { isPaid: true },
                        { status: 'Delivered' },
                        { status: 'Completed' }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

        // Lấy 5 đơn hàng mới nhất để hiển thị bảng
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'firstName lastName email') // Lấy thông tin người mua
            .select('user totalPrice status createdAt');   // Chỉ lấy các trường cần thiết

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders
            }
        });

    } catch (error) {
        console.error("Lỗi thống kê:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy thống kê', error: error.message });
    }
};

module.exports = { getDashboardStats };