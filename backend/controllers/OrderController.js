const Order = require('../models/OrderProduct');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// --- HÀM CẬP NHẬT KHO (Viết tách ra để code gọn hơn) ---
const updateProductStock = async (orderItems) => {
    try {
        for (const item of orderItems) {
            const qty = parseInt(item.quantity) || 0;
            if (qty <= 0) continue;

            // TRƯỜNG HỢP 1: MUA BIẾN THỂ (Có variantName)
            if (item.variantName) {
                // Dùng $inc để cập nhật nguyên tử (Atomic Update)
                const result = await Product.findOneAndUpdate(
                    { 
                        _id: item.product,
                        "variants.name": item.variantName // Tìm đúng biến thể
                    },
                    {
                        $inc: {
                            "variants.$.countInStock": -qty, // 1. Trừ kho của biến thể
                            "selled": +qty,
                            "countInStock": -qty // <--- 2. QUAN TRỌNG: Trừ luôn vào KHO TỔNG của sản phẩm cha
                        }
                    },
                    { new: true }
                );
                
                if (result) {
                    console.log(`Đã trừ kho BIẾN THỂ '${item.variantName}' & KHO TỔNG - SL: ${qty}`);
                } else {
                    // Fallback: Nếu tên biến thể bị lệch (khoảng trắng/case), tìm thủ công
                    const product = await Product.findById(item.product);
                    if (product) {
                        const variantIndex = product.variants.findIndex(v => v.name.trim() === item.variantName.trim());
                        if (variantIndex >= 0) {
                            product.variants[variantIndex].countInStock -= qty;
                            product.countInStock -= qty; // Trừ kho tổng thủ công
                            product.selled = (product.selled || 0) + qty;
                            
                            product.markModified('variants');
                            await product.save();
                        }
                    }
                }
            } 
            // TRƯỜNG HỢP 2: MUA SẢN PHẨM THƯỜNG (Không biến thể)
            else {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            countInStock: -qty, // Trừ kho tổng
                            selled: +qty
                        }
                    }
                );
            }
        }
    } catch (e) {
        console.error("Lỗi cập nhật kho:", e);
    }
};

// --- HÀM 1: createOrder ---
const createOrder = async (req, res) => {
    try {
        const {
            paymentMethod, itemsPrice, shippingPrice, totalPrice,
            user, isPaid, paidAt,
            fullName, address, city, phone, email,
            couponCode, discountPrice // <--- Nhận thêm từ Frontend
        } = req.body;

        if (!req.body.orderItems || req.body.orderItems.length === 0) {
            return res.status(400).json({ status: 'ERR', message: 'Giỏ hàng rỗng' });
        }

        // [MỚI] XỬ LÝ COUPON (Server Side Validation)
        let finalTotalPrice = totalPrice;
        let appliedDiscount = 0;

        if (couponCode) {
            const coupon = await Coupon.findOne({ 
                code: couponCode.toUpperCase(), 
                status: true,
                endDate: { $gte: new Date() }, // Còn hạn
                startDate: { $lte: new Date() }
            });

            if (coupon) {
                // Check usage limit
                if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
                     return res.status(400).json({ status: 'ERR', message: 'Mã giảm giá đã hết lượt sử dụng' });
                }
                
                // Cập nhật số lần dùng
                coupon.usedCount += 1;
                await coupon.save();
                
                appliedDiscount = discountPrice || 0; // Hoặc tính lại discount tại đây để an toàn hơn
            } else {
                return res.status(400).json({ status: 'ERR', message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' });
            }
        }

        // Xử lý địa chỉ
        const rawShipping = req.body.shippingAddress || {};
        const shippingAddress = {
            fullName: rawShipping.fullName || fullName,
            address: rawShipping.address || address,
            city: rawShipping.city || city,
            phone: rawShipping.phone || phone,
            email: rawShipping.email || email
        };

        if (!shippingAddress.email) {
            return res.status(400).json({ status: 'ERR', message: 'Cần cung cấp Email' });
        }

        const newOrder = await Order.create({
            orderItems: req.body.orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice: finalTotalPrice,
            
            // Lưu thông tin Coupon vào Order
            couponCode: couponCode || '',
            discountPrice: appliedDiscount,

            user: user || null,
            isPaid: isPaid || false,
            paidAt: paidAt || null,
            email: shippingAddress.email
        });

        if (newOrder) {
            await updateProductStock(req.body.orderItems);
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Tạo đơn hàng thành công',
            data: newOrder
        });

    } catch (e) {
        console.error("Lỗi Controller CreateOrder:", e);
        return res.status(500).json({ status: 'ERR', message: 'Lỗi server', error: e.message });
    }
};

// --- HÀM 2: getAllOrder ---
const getAllOrder = async (req, res) => {
    try {
        const userId = req.params.id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ status: 'OK', data: orders });
    } catch (e) { res.status(500).json({ status: 'ERR', error: e.message }) }
};

// --- HÀM 3: getDetailsOrder ---
const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ status: 'ERR', message: 'Not found' });
        res.status(200).json({ status: 'OK', data: order });
    } catch (e) { res.status(500).json({ status: 'ERR', error: e.message }) }
};

// --- HÀM 4: cancelOrderProduct (User hủy đơn) ---
const cancelOrderProduct = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: 'ERR', message: 'Không tìm thấy đơn hàng' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ 
                status: 'ERR', 
                message: 'Không thể hủy đơn hàng đã xác nhận/đang giao.' 
            });
        }

        // HOÀN LẠI LƯỢT DÙNG COUPON (Nếu đơn có dùng)
        if (order.couponCode) {
            const coupon = await Coupon.findOne({ code: order.couponCode });
            if (coupon) {
                coupon.usedCount = Math.max(0, coupon.usedCount - 1);
                await coupon.save();
                console.log(`-> Đã hoàn lại lượt dùng mã: ${order.couponCode}`);
            }
        }

        order.status = 'Cancelled';
        order.isDelivered = false;
        await order.save();

        return res.status(200).json({
            status: 'OK',
            message: 'Hủy đơn hàng thành công',
            data: order
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi hủy đơn hàng',
            error: e.message
        });
    }
};

// --- ADMIN: LẤY TẤT CẢ ĐƠN HÀNG ---
const getAllOrdersSystem = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status;
        let query = {};
        if (status) query.status = status;
        const totalOrders = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({
            status: 'OK',
            data: orders,
            total: totalOrders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit)
        });
    } catch (e) {
        res.status(500).json({ message: 'Lỗi server', error: e.message });
    }
};

// --- ADMIN: CẬP NHẬT TRẠNG THÁI ---
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        order.status = status;
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            if ((order.paymentMethod || '').toLowerCase().includes('cod')) {
                order.isPaid = true;
                order.paidAt = Date.now();
            }
        } else {
            order.isDelivered = false;
            order.deliveredAt = null;
        }
        await order.save();
        res.status(200).json({ status: 'OK', message: 'Success', data: order });
    } catch (e) {
        res.status(500).json({ message: 'Error', error: e.message });
    }
};

// --- ADMIN: CHI TIẾT ---
const getDetailsOrderAdmin = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('user', 'name email');
        if (!order) return res.status(404).json({ status: 'ERR', message: 'Not found' });
        res.status(200).json({ status: 'OK', data: order });
    } catch (e) { res.status(500).json({ status: 'ERR', error: e.message }) }
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