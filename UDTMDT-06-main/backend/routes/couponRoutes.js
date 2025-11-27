const express = require('express');
const router = express.Router();
const { protect: auth, adminOnly } = require('../middleware/authMiddleware');
const couponController = require('../controllers/couponController');

// Tất cả route đều cần quyền Admin
router.get('/', auth, adminOnly, couponController.getAllCoupons);
router.post('/', auth, adminOnly, couponController.createCoupon);
router.put('/:id', auth, adminOnly, couponController.updateCoupon);
router.delete('/:id', auth, adminOnly, couponController.deleteCoupon);
router.put('/status/:id', auth, adminOnly, couponController.toggleCouponStatus);

module.exports = router;