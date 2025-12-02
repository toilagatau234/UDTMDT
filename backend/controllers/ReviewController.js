const Review = require('../models/ReviewModel');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// =======================================================
// --- HÀM PHỤ: TÍNH TRUNG BÌNH SAO (GIỮ NGUYÊN, VỊ TRÍ ĐÚNG) ---
// =======================================================
const calculateAverageRating = async (productId) => {
    try {
        const stats = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } }, 
            {
                $group: {
                    _id: '$product',
                    nReviews: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);
        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                rating: Math.round(stats[0].avgRating * 10) / 10,
            });
        }
    } catch (error) {
        console.error("❌ Lỗi khi tính toán Average Rating:", error);
    }
};

// =======================================================
// --- TẠO ĐÁNH GIÁ (ĐÃ SỬA LỖI 500 VÀ THÊM KIỂM TRA TRÙNG LẶP) ---
// =======================================================
const createReview = async (req, res) => {
    try {
        // Lấy đầy đủ các trường cần thiết, bao gồm orderId (vì Schema bắt buộc)
        const { productId, rating, comment, images, orderId } = req.body; 
        const userId = req.user._id; // Lấy _id chuẩn Mongoose

        // 1. KIỂM TRA THÔNG TIN BẮT BUỘC
        if (!productId || !rating || !comment || !orderId) { 
            return res.status(400).json({ status: 'ERR', message: 'Thiếu thông tin đánh giá hoặc Order ID.' });
        }

        // 2. KIỂM TRA TRÙNG LẶP (QUAN TRỌNG ĐỂ KHÔNG ĐÁNH GIÁ NHIỀU LẦN)
        // Kiểm tra xem User này đã từng đánh giá sản phẩm này chưa.
        // HOẶC: Kiểm tra xem orderId này đã được đánh giá chưa (Chuẩn hơn nếu muốn mỗi đơn hàng được đánh giá 1 lần).
        const existingReview = await Review.findOne({
            user: userId,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({ status: 'ERR', message: 'Bạn đã đánh giá sản phẩm này rồi. Mỗi khách hàng chỉ được đánh giá một lần cho mỗi sản phẩm.' });
        }
        
        // *******************************************************************
        // NẾU BẠN MUỐN DÙNG LOGIC: MỖI ĐƠN HÀNG CHỈ ĐƯỢC ĐÁNH GIÁ 1 LẦN
        // Bạn thay thế logic trên bằng:
        // const existingOrderReview = await Review.findOne({ order: orderId });
        // if (existingOrderReview) {
        //     return res.status(400).json({ status: 'ERR', message: 'Đơn hàng này đã được đánh giá.' });
        // }
        // *******************************************************************

        // 3. TẠO REVIEW
        const newReview = await Review.create({
            user: userId,
            product: productId,
            rating: Number(rating),
            comment,
            images: images || [],
            order: orderId // Thêm trường bắt buộc
        });

        // 4. TÍNH TOÁN RATING
        await calculateAverageRating(productId); 

        res.status(201).json({ status: 'OK', message: 'Đánh giá thành công', data: newReview });
    } catch (error) {
        console.error("❌ Lỗi Server khi tạo đánh giá:", error);
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

// --- LẤY DANH SÁCH ĐÁNH GIÁ (GIỮ NGUYÊN) ---
const getReviewsByProduct = async (req, res) => {
    // ... (Phần code này giữ nguyên)
    try {
        const { productId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ product: productId })
            .populate('user', 'firstName lastName avatar') 
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ product: productId });

        res.status(200).json({ 
            status: 'OK', 
            data: reviews, 
            total, 
            page, 
            totalPage: Math.ceil(total / limit) 
        });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
    }
};

module.exports = { createReview, getReviewsByProduct };