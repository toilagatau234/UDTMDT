// backend/controllers/productController.js
const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const Brand = require('../models/Brand.js');
const User = require('../models/User.js');
const mongoose = require('mongoose');

// --- 1. LẤY TẤT CẢ SẢN PHẨM (Đã thêm Lookup Category) ---
const getAllProducts = async (req, res) => {
  try {
    const {
      search, category, brand, rating, price_from, price_to, page, limit, status
    } = req.query;

    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skipCount = (currentPage - 1) * pageSize;

    const matchStage = {};

    // Filter cơ bản
    if (search) matchStage.name = { $regex: search, $options: 'i' };
    if (status) matchStage.status = status; // Hỗ trợ lọc theo status

    // Filter Category (Tìm ID từ tên hoặc ID trực tiếp)
    if (category) {
      // Kiểm tra xem category gửi lên là ID hay Tên
      if (mongoose.Types.ObjectId.isValid(category)) {
        matchStage.category = new mongoose.Types.ObjectId(category);
      } else {
        const categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } });
        if (categoryDoc) matchStage.category = categoryDoc._id;
      }
    }

    // Filter Giá
    if (price_from || price_to) {
      matchStage.price = {};
      if (price_from) matchStage.price.$gte = Number(price_from);
      if (price_to) matchStage.price.$lte = Number(price_to);
    }

    // Pipeline Aggregate
    const pipeline = [
      { $match: matchStage },
      // --- QUAN TRỌNG: JOIN VỚI BẢNG CATEGORIES ĐỂ LẤY TÊN ---
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
      // Gán lại field category để frontend đọc được product.category.name
      {
        $addFields: {
          category: '$categoryData'
        }
      },
      // --------------------------------------------------------
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skipCount }, { $limit: pageSize }],
          totalCount: [{ $count: 'count' }]
        }
      }
    ];

    const result = await Product.aggregate(pipeline);
    const products = result[0].data;
    const total = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;

    return res.status(200).json({
      message: 'Thành công',
      data: products,
      total,
      currentPage,
      pageSize
    });

  } catch (error) {
    console.error("Lỗi get all products:", error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// --- 2. LẤY CHI TIẾT SẢN PHẨM (Để Edit) ---
const getProductDetails = async (req, res) => {
  try {
    // Populate category để form edit lấy được ID và Tên
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('brand');
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    return res.status(200).json({ data: product }); // Trả về dạng { data: product } cho thống nhất
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// --- 3. TẠO SẢN PHẨM ---
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, isFlashSale, countInStock, flashSalePrice, variants } = req.body;

    let imageObjects = [];
    if (req.files && req.files.length > 0) {
      imageObjects = req.files.map(file => ({ url: `/uploads/${file.filename}` }));
    }

    let parsedVariants = [];
    if (variants) {
      try { parsedVariants = JSON.parse(variants); } catch (e) { }
    }

    // Tính tổng tồn kho từ các biến thể
    let totalStock = Number(countInStock) || 0;
    if (parsedVariants.length > 0) {
      totalStock = parsedVariants.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);
    }
    const product = new Product({
      name,
      price: Number(price) || 0,
      description,
      category, // Mongoose sẽ tự cast String ID sang ObjectId
      countInStock: totalStock,
      images: imageObjects,
      variations: parsedVariants, // Save as 'variations'
      isFlashSale: isFlashSale === 'true' || isFlashSale === true,
      flashSalePrice: Number(flashSalePrice) || 0,
      user: req.user ? req.user._id : null
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Tạo thành công', product: createdProduct });
  } catch (error) {
    console.error("Lỗi tạo SP:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// --- 4. CẬP NHẬT SẢN PHẨM (Sửa lỗi Status) ---
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy' });

    const {
      name, price, description, category,
      isFlashSale, flashSalePrice, variants,
      status, // <--- Đã lấy status từ request
      existingImages
    } = req.body;

    // Update các trường cơ bản nếu có gửi lên
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (status) product.status = status; // <--- Cập nhật status

    if (isFlashSale !== undefined) product.isFlashSale = isFlashSale;
    if (flashSalePrice !== undefined) product.flashSalePrice = flashSalePrice;

    // Xử lý Variants
    if (variants) {
      try {
        product.variations = JSON.parse(variants);
        // Cập nhật lại tổng tồn kho
        product.countInStock = product.variations.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);
      } catch (e) { }
    }

    // Xử lý ảnh: Giữ ảnh cũ + Thêm ảnh mới
    let finalImages = [];

    // 1. Ảnh cũ (Frontend gửi lên dạng JSON string array)
    if (existingImages) {
      try { finalImages = JSON.parse(existingImages); } catch (e) { finalImages = product.images; }
    }
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({ url: `/uploads/${file.filename}` }));
      finalImages = [...finalImages, ...newImages];
    }
    // Only update images if there's a change
    if (req.files?.length > 0 || (existingImages && finalImages.length !== product.images.length)) {
      product.images = finalImages;
    }

    await product.save();
    res.status(200).json({ message: 'Cập nhật thành công', product });
  } catch (error) {
    console.error("Lỗi update:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// --- 5. XÓA SẢN PHẨM ---
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getAllProductsPublic = getAllProducts; // Reuse or create specific one
const getProductByIdPublic = getProductDetails;
const addToWishlist = async (req, res) => { res.status(200).json({}); };

module.exports = {
  getAllProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  getAllProductsPublic,
  getProductByIdPublic
};