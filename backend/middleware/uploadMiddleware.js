const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Hàm tạo thư mục nếu chưa tồn tại
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        let folder = 'others'; // Mặc định

        // 1. Logic phân loại thư mục
        if (file.fieldname === 'images') {
            folder = 'product-img'; // Album sản phẩm
        } else if (file.fieldname === 'variantImages') {
            folder = 'variants-img'; // Ảnh biến thể
        } else if (
            // Kiểm tra nếu field là 'image' VÀ đường dẫn API có chứa chữ 'brand'
            file.fieldname === 'image' && 
            req.originalUrl.includes('brand')
        ) {
            folder = 'brand-img'; // Ảnh thương hiệu
        } else if (
            // Fallback: Nếu upload ảnh đại diện sản phẩm (trường hợp dùng single upload)
            file.fieldname === 'image' && 
            req.originalUrl.includes('products')
        ) {
            folder = 'product-img';
        }

        // 2. Tạo đường dẫn tuyệt đối
        const uploadPath = path.join(__dirname, '../uploads', folder);
        
        // 3. Tạo thư mục
        ensureDir(uploadPath);

        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;