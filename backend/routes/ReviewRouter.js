// routes/ReviewRouter.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const { protect } = require('../middleware/authMiddleware'); // Đảm bảo bạn import 'protect'

router.post('/create', protect, reviewController.createReview); // Đã sửa tên middleware thành 'protect'
router.get('/get-reviews/:productId', reviewController.getReviewsByProduct);

module.exports = router;