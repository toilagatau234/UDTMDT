// models/Brand.js
const mongoose = require('mongoose');

// --- SCHEMA THƯƠNG HIỆU ---
const brandSchema = new mongoose.Schema({ 
    name: {            // Tên thương hiệu
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {            // Slug dùng URL
        type: String,
        required: true,
        unique: true
    },
    logo: {            // Link logo
        type: String
    }
}, { timestamps: true }); // Tạo createdAt, updatedAt

// --- TẠO VÀ EXPORT MODEL 'Brand' ---
const Brand = mongoose.model('Brand', brandSchema); 
module.exports = Brand;
