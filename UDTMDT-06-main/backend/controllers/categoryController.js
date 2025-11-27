const Category = require('../models/Category');

// Hàm hỗ trợ tạo slug (không dấu, nối gạch ngang)
const createSlug = (text) => {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
        .replace(/\s+/g, '-')           // Thay khoảng trắng bằng -
        .replace(/[^\w\-]+/g, '')       // Bỏ ký tự đặc biệt
        .replace(/\-\-+/g, '-')         // Bỏ dấu - trùng lặp
        .replace(/^-+/, '')             // Bỏ dấu - ở đầu
        .replace(/-+$/, '');            // Bỏ dấu - ở cuối
};

// Lấy danh sách (Có phân trang & Tìm kiếm)
const getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search 
            ? { name: { $regex: search, $options: 'i' } } 
            : {};

        const totalCategories = await Category.countDocuments(query);
        const categories = await Category.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            categories,
            totalPages: Math.ceil(totalCategories / limit),
            currentPage: page,
            totalCategories
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Thêm danh mục
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });

        const slug = createSlug(name);
        
        // Kiểm tra trùng slug
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({ message: 'Danh mục này đã tồn tại' });
        }

        const newCategory = new Category({ name, slug });
        await newCategory.save();

        res.status(201).json({ message: 'Tạo danh mục thành công', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        category.name = name || category.name;
        if (name) {
            category.slug = createSlug(name);
        }

        await category.save();
        res.status(200).json({ message: 'Cập nhật thành công', category });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Đổi trạng thái (Toggle Status)
const toggleStatusCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Boolean từ frontend

        const category = await Category.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        res.status(200).json({ message: 'Cập nhật trạng thái thành công', category });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatusCategory
};