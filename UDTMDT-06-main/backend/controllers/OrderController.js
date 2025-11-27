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

// --- HÀM 4: cancelOrderProduct (Chuẩn) ---
const cancelOrderProduct = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ status: 'ERR', message: 'Thiếu Order ID' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { isCancelled: true }, // Lưu ý: Model phải có trường này nếu muốn lưu
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy đơn hàng' });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Hủy đơn hàng thành công',
            data: updatedOrder
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi hủy đơn hàng',
            error: e.message
        });
    }
};

// --- ADMIN ---
// --- LẤY TẤT CẢ ĐƠN HÀNG ---
const getAllOrdersSystem = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status;

        let query = {};
        
        // Lọc theo trạng thái nếu có
        if (status) {
            query.status = status;
        }

        // Tìm kiếm (Đơn giản hóa: tìm theo ID đơn hàng hoặc tên người nhận)
        // Lưu ý: Tìm theo nested field (shippingAddress.fullName) cần aggregate hoặc logic phức tạp hơn, 
        // ở đây tạm thời tìm theo _id nếu search có dạng ObjectId, hoặc bỏ qua nếu khó.
        // Để đơn giản cho bước này, ta chưa apply search phức tạp.

        const totalOrders = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: 'OK',
            message: 'Lấy danh sách đơn hàng thành công',
            data: orders,
            total: totalOrders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit)
        });
    } catch (e) {
        res.status(500).json({ message: 'Lỗi server', error: e.message });
    }
};

// --- CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Thiếu trạng thái mới' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        order.status = status;
        
        // Tự động cập nhật isDelivered nếu status là Delivered
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({ status: 'OK', message: 'Cập nhật thành công', data: order });
    } catch (e) {
        res.status(500).json({ message: 'Lỗi server', error: e.message });
    }
};

// --- LẤY CHI TIẾT ĐƠN HÀNG ---
const getDetailsOrderAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy đơn hàng' });
        }
        return res.status(200).json({ status: 'OK', data: order });
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: 'Lỗi server', error: e.message });
    }
};

module.exports = { 
    createOrder,
    getAllOrder,
    getDetailsOrder,
    cancelOrderProduct,
    getAllOrdersSystem,
    updateOrderStatus,
    getDetailsOrderAdmin,
};