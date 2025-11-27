const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true,
        default: []
    }, // Stores image URLs
    category: {
        type: mongoose.Schema.Types.ObjectId, // MUST be ObjectId to link with Category
        ref: 'Category',
        required: true
    },
    brand: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Brand' 
    },
    price: { 
        type: Number,
        required: true, 
        default: 0 
    },
    salePrice: { 
        type: Number, 
        default: 0 },
    countInStock: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    description: { 
        type: String 
    },
    slug: { 
        type: String 
    },
    status: { 
        type: String, 
        default: 'in_stock' 
    }, // Fix status not saving
    isFlashSale: { 
        type: Boolean, 
        default: false 
    },
    flashSalePrice: { 
        type: Number, 
        default: 0 
    },

    // --- ADD THIS FIELD TO STORE VARIANTS ---
    variations: [
        {
            color: { type: String },
            size: { type: String },
            quantity: { type: Number, default: 0 },
            price: { type: Number, default: 0 }
        }
    ],
    // ----------------------------------------
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;