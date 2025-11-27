// models/Product.js
const mongoose = require('mongoose');

// --- SCHEMA SẢN PHẨM ---
const productSchema = new mongoose.Schema({
    name: {              // Tên sản phẩm
        type: String,
        required: true
    },
    images: {            // Mảng ảnh sản phẩm
        type: Array,
        required: true
    },
    category: {          // ID hoặc tên danh mục
        type: String
    },
    brand: {             // ID hoặc tên thương hiệu
        type: String
    },
    price: {             // Giá gốc
        type: Number,
        required: true
    },
    salePrice: {         // Giá sale (nếu có)
        type: Number
    },
    stockQuantity: {     // Số lượng trong kho
        type: Number,
        required: true
    },
    description: {       // Mô tả sản phẩm
        type: String
    },
    slug: {              // Slug dùng URL
        type: String
    },
    sku: {               // Mã sản phẩm
        type: String
    },
    status: {            // Trạng thái: in_stock, out_of_stock
        type: String,
        default: 'in_stock'
    },
    isOnSale: {          // Có đang sale hay không
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // createdAt, updatedAt tự động

// --- TẠO VÀ EXPORT MODEL 'Product' ---
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
