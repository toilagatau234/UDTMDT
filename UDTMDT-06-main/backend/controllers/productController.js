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
    if (search) {
      matchStage.name = { $regex: search, $options: 'i' };
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

// --- XUẤT MODULE ---
module.exports = {
  getAllProducts,
  getProductDetails,
  addToWishlist 
};