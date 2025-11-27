const express = require('express');
const router = express.Router();
const { protect: auth, adminOnly } = require('../middleware/authMiddleware');
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatusCategory
} = require('../controllers/categoryController');

// Định nghĩa các route
router.get('/',auth, adminOnly, getAllCategories); // Hoặc thêm auth, adminOnly nếu muốn chặn người ngoài xem
router.post('/', auth, adminOnly, createCategory);
router.put('/:id', auth, adminOnly, updateCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);
router.put('/toggle-status/:id', auth, adminOnly, toggleStatusCategory);

module.exports = router;