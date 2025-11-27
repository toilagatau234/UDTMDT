const express = require('express');
const router = express.Router();

// --- 1. IMPORT MIDDLEWARE (ĐÃ SỬA) ---
// Import trực tiếp 'protect' và 'adminOnly' từ file authMiddleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Import Controller
const productController = require('../controllers/productController.js');
const upload = require('../middleware/uploadMiddleware'); 

// --- 2. LẤY HÀM TỪ CONTROLLER ---
const { 
    getAllProducts,     
    getProductDetails,  
    addToWishlist,      
    createProduct,
    updateProduct,
    deleteProduct
} = productController;

// --- 3. KHAI BÁO ROUTE ---

// --- ROUTE YÊU THÍCH ---
if (typeof addToWishlist === 'function') {
    router.post('/add-to-wishlist/:id', protect, addToWishlist);
} else {
    console.log("⚠️ CẢNH BÁO: Server chưa tìm thấy hàm 'addToWishlist'.");
}

// --- CÁC ROUTE CÔNG KHAI (AI CŨNG XEM ĐƯỢC) ---
router.get('/', getAllProducts);
router.get('/:id', getProductDetails);

// --- CÁC ROUTE ADMIN (CHỈ ADMIN MỚI ĐƯỢC DÙNG) ---
// Lưu ý: Thay 'authMiddleware' bằng 'protect'
router.post('/', protect, adminOnly, upload.array('images', 10), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;