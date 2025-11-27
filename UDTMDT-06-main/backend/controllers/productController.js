const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const Brand = require('../models/Brand.js');
const User = require('../models/User.js');

// --- 1. LẤY TẤT CẢ SẢN PHẨM ---
const getAllProducts = async (req, res) => {
  try {
    const {
      search, category, brand, rating, price_from, price_to, page, limit
    } = req.query;

    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 8;
    const skipCount = (currentPage - 1) * pageSize;

    const pipeline = [];
    const matchStage = {};

    // Filter theo tên
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    // Filter theo rating
    if (rating) {
      const ratingNum = Number(rating);
      if (ratingNum === 5) {
        matchStage['reviewSummary.averageRating'] = { $gte: 5 };
      } else {
        matchStage['reviewSummary.averageRating'] = { $gte: ratingNum, $lt: ratingNum + 1 };
      }
    }

    // Filter theo danh mục
    if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${category}$`, 'i') }
      });
      if (!categoryDoc) return res.status(200).json({ message: 'OK', data: [], total: 0 });
      matchStage.category = categoryDoc._id;
    }

    // Filter theo thương hiệu
    if (brand) {
      const brandNames = Array.isArray(brand) ? brand : [brand];
      const brandDocs = await Brand.find({
        name: { $in: brandNames.map(b => new RegExp(`^${b}$`, 'i')) }
      });
      if (brandDocs.length === 0) return res.status(200).json({ message: 'OK', data: [], total: 0 });
      matchStage.brand = { $in: brandDocs.map(b => b._id) };
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Filter giá
    if (price_from || price_to) {
      const priceFilter = {};
      if (price_from) priceFilter.$gte = Number(price_from);
      if (price_to) priceFilter.$lte = Number(price_to);

      pipeline.push({
        $match: {
          variations: { $exists: true, $ne: [] },
          'variations.0.price': priceFilter
        }
      });
    }

    // Đếm tổng
    const countPipeline = [...pipeline, { $count: 'total' }];
    const totalProducts = await Product.aggregate(countPipeline);
    const total = totalProducts[0]?.total || 0;

    // Phân trang & Sort
    pipeline.push({ $sort: { _id: -1 } });
    pipeline.push({ $skip: skipCount });
    pipeline.push({ $limit: pageSize });

    const products = await Product.aggregate(pipeline);

    return res.status(200).json({
      message: 'Lấy sản phẩm thành công',
      data: products,
      total,
      currentPage,
      pageSize
    });

  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// --- 2. LẤY CHI TIẾT SẢN PHẨM ---
const getProductDetails = async (req, res) => {
  try {
    const { id: productId } = req.params;

    if (!productId) return res.status(400).json({ message: 'Product ID là bắt buộc' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    return res.status(200).json({
      message: 'Lấy chi tiết sản phẩm thành công',
      data: product
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// --- 3. HÀM XỬ LÝ YÊU THÍCH ---
const addToWishlist = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    // Kiểm tra xem đã có chưa
    const alreadyadded = user.wishlist.find((idString) => idString.toString() === id);

    if (alreadyadded) {
      // Xóa đi
      let updatedUser = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: id } },
        { new: true }
      );
      return res.status(200).json({ status: 'OK', message: 'Đã xóa khỏi danh sách yêu thích', user: updatedUser });
    } else {
      // Thêm vào
      let updatedUser = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: id } },
        { new: true }
      );
      return res.status(200).json({ status: 'OK', message: 'Đã thêm vào danh sách yêu thích', user: updatedUser });
    }
  } catch (error) {
    console.error("Lỗi Wishlist:", error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// TẠO SẢN PHẨM MỚI (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, brand, countInStock, variants } = req.body;

    // 1. Xử lý ảnh: Chuyển đổi file path thành object { url: ... }
    let imageObjects = [];
    if (req.files && req.files.length > 0) {
      imageObjects = req.files.map(file => ({
        url: `/uploads/${file.filename}`
      }));
    }

    // 2. Xử lý Variants (Frontend gửi lên dạng chuỗi JSON)
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (e) {
        console.error("Lỗi parse variants:", e);
      }
    }

    const product = new Product({
      name,
      price: price || 0,
      originalPrice: originalPrice || 0,
      description,
      category,
      brand,
      countInStock: countInStock || 0,
      images: imageObjects, // Lưu đúng cấu trúc [{url: '...'}]
      variations: parsedVariants,
      user: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Tạo sản phẩm thành công', product: createdProduct });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo sản phẩm', error: error.message });
  }
};

// --- 4. CẬP NHẬT SẢN PHẨM ---
const updateProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, brand, countInStock, variants } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.originalPrice = originalPrice || product.originalPrice;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.countInStock = countInStock || product.countInStock;

      // Cập nhật variants
      if (variants) {
        try {
          product.variations = JSON.parse(variants);
        } catch (e) { }
      }

      // Nếu có upload ảnh mới -> Thay thế ảnh cũ
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
          url: `/uploads/${file.filename}`
        }));
        product.images = newImages;
      }

      const updatedProduct = await product.save();
      res.status(200).json({ message: 'Cập nhật thành công', product: updatedProduct });
    } else {
      res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật', error: error.message });
  }
};

// XÓA SẢN PHẨM (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } else {
      res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa sản phẩm', error: error.message });
  }
};

// --- XUẤT MODULE ---
module.exports = {
  getAllProducts,
  getProductDetails,
  addToWishlist,
  createProduct,
  updateProduct,
  deleteProduct

};