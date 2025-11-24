const CouponModel = require('../models/coupon.model');

// Lấy danh sách mã giảm giá (Cho Admin)
const getCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find().sort({ created: -1 });
    return res.status(200).json({ list: coupons });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo mã giảm giá mới
const createCoupon = async (req, res) => {
  try {
    const { code, discount, usageLimit, expireDate } = req.body;
    const exists = await CouponModel.findOne({ code });
    if (exists) return res.status(400).json({ message: "Mã này đã tồn tại" });

    const newCoupon = new CouponModel({ code, discount, usageLimit, expireDate });
    await newCoupon.save();
    return res.status(200).json({ message: "Tạo mã thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa mã giảm giá
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.query;
    await CouponModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Kiểm tra mã giảm giá (Khi người dùng nhập ở Payment)
const checkCoupon = async (req, res) => {
  try {
    const { code } = req.query;
    const coupon = await CouponModel.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }
    if (coupon.usageLimit <= 0) {
      return res.status(400).json({ message: "Mã này đã hết lượt sử dụng" });
    }
    if (new Date() > new Date(coupon.expireDate)) {
      return res.status(400).json({ message: "Mã này đã hết hạn" });
    }

    // Trả về thông tin giảm giá nếu hợp lệ
    return res.status(200).json({ 
      discount: coupon.discount, 
      code: coupon.code,
      _id: coupon._id 
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  deleteCoupon,
  checkCoupon
};