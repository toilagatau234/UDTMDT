const express = require('express');
const router = express.Router();

// --- 1. IMPORT ---
// Import middleware (tự động xử lý dù export kiểu nào cũng nhận được)
const authMiddleware = require('../middleware/authMiddleware');
const protect = authMiddleware.protect ? authMiddleware.protect : authMiddleware;

// Import Controller
const productController = require('../controllers/productController.js');

// --- 2. LẤY HÀM (Destructuring) ---
// Lấy các hàm cũ và hàm mới từ Controller
const { 
    getAllProducts,     // Hàm cũ
    getProductDetails,  // Hàm cũ
    addToWishlist       // Hàm MỚI
} = productController;

// --- 3. KHAI BÁO ROUTE ---

// --- ROUTE MỚI: Thêm vào yêu thích (Method POST) ---
// (Tôi thêm kiểm tra 'if' để nếu lỡ Controller chưa lưu kịp thì server không bị sập)
if (typeof addToWishlist === 'function') {
    router.post('/add-to-wishlist/:id', protect, addToWishlist);
} else {
    console.log("⚠️ CẢNH BÁO: Server chưa tìm thấy hàm 'addToWishlist'. Hãy kiểm tra lại file ProductController.");
}

// --- CÁC ROUTE CŨ (GIỮ NGUYÊN KHÔNG ĐỤNG CHẠM) ---
router.get('/', getAllProducts);
router.get('/:id', getProductDetails);

module.exports = router;