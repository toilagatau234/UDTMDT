const Coupon = require('../models/Coupon');

// Tạo mã giảm giá
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderValue, maxDiscountAmount, startDate, endDate, usageLimit } = req.body;

        // Kiểm tra trùng mã
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Mã giảm giá này đã tồn tại!' });
        }

        const newCoupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscountAmount,
            startDate,
            endDate,
            usageLimit
        });

        res.status(201).json({ status: 'OK', message: 'Tạo mã thành công', data: newCoupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Lấy danh sách (Admin)
const getAllCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search ? { code: { $regex: search, $options: 'i' } } : {};

        const totalCoupons = await Coupon.countDocuments(query);
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: 'OK',
            data: coupons,
            totalPages: Math.ceil(totalCoupons / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật mã
const updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCoupon) return res.status(404).json({ message: 'Không tìm thấy mã' });
        res.status(200).json({ status: 'OK', message: 'Cập nhật thành công', data: updatedCoupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xóa mã
const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'OK', message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Toggle Status (Ẩn/Hiện)
const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Không tìm thấy mã' });
        
        coupon.status = !coupon.status;
        await coupon.save();
        
        res.status(200).json({ status: 'OK', message: 'Cập nhật trạng thái thành công', data: coupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus
};