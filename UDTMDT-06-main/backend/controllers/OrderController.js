const Order = require('../models/OrderProduct');
const Product = require('../models/Product');

// --- HÀM 1: createOrder (Đã sửa logic nhận Email) ---
const createOrder = async (req, res) => {
    try {
        const { 
            paymentMethod, 
            itemsPrice, 
            shippingPrice, 
            totalPrice, 
            user,
            isPaid, 
            paidAt,
            // Thêm email vào đây để hứng dữ liệu từ Frontend
            fullName, address, city, phone, email 
        } = req.body;

        // 1. Kiểm tra giỏ hàng
        if (!req.body.orderItems || req.body.orderItems.length === 0) {
            return res.status(400).json({ status: 'ERR', message: 'Giỏ hàng rỗng' });
        }

        // 2. Xử lý địa chỉ (QUAN TRỌNG: Phải merge Email vào đây)
        // Logic cũ của bạn bị lỗi vì nó ưu tiên lấy req.body.shippingAddress mà bên trong đó lại không có email.
        // Logic mới: Tự tạo object shippingAddress chuẩn đầy đủ thông tin.
        
        const rawShipping = req.body.shippingAddress || {};
        
        const shippingAddress = {
            fullName: rawShipping.fullName || fullName,
            address: rawShipping.address || address,
            city: rawShipping.city || city,
            phone: rawShipping.phone || phone,
            email: rawShipping.email || email // <--- BẮT BUỘC PHẢI CÓ DÒNG NÀY
        };

        // Kiểm tra lần cuối
        if (!shippingAddress.email) {
            return res.status(400).json({ status: 'ERR', message: 'Cần cung cấp Email để tạo đơn hàng' });
        }

        // 3. TẠO ĐƠN HÀNG
        const newOrder = await Order.create({
            orderItems: req.body.orderItems,
            shippingAddress, // Đã chứa email
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user: user || null,
            isPaid: isPaid || false,
            paidAt: paidAt || null,
            email: shippingAddress.email // Lưu thêm email ở root nếu model yêu cầu
        });

        return res.status(200).json({
            status: 'OK',
            message: 'Tạo đơn hàng thành công',
            data: newOrder
        });

    } catch (e) {
        console.error("Lỗi Controller CreateOrder:", e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server khi tạo đơn hàng',
            error: e.message
        });
    }
};

// --- HÀM 2: getAllOrder ---
const getAllOrder = async (req, res) => {
    try {
        const userId = req.params.id; 
        if (!userId) {
             return res.status(400).json({ status: 'ERR', message: 'Thiếu User ID' });
        }
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            status: 'OK',
            data: orders
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi lấy danh sách đơn hàng',
            error: e.message
        });
    }
};

// --- HÀM 3: getDetailsOrder ---
const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
             return res.status(400).json({ status: 'ERR', message: 'Thiếu Order ID' });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy đơn hàng' });
        }
        return res.status(200).json({
            status: 'OK',
            data: order
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi lấy chi tiết đơn hàng',
            error: e.message
        });
    }
};

// --- HÀM 4: cancelOrderProduct ---
const cancelOrderProduct = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ status: 'ERR', message: 'Thiếu Order ID' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
             return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy đơn hàng' });
        }

        // Xóa đơn hàng
        await Order.findByIdAndDelete(orderId);

        return res.status(200).json({
            status: 'OK',
            message: 'Hủy đơn hàng thành công',
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi hủy đơn hàng',
            error: e.message
        });
    }
};

module.exports = { 
    createOrder,
    getAllOrder,
    getDetailsOrder,
    cancelOrderProduct
};