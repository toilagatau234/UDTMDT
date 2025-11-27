const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const protect = async (req, res, next) => {
    console.log("\n--- [AUTH DEBUG] Bắt đầu kiểm tra Token ---");
    
    // 1. In ra tất cả headers nhận được để xem Frontend gửi gì lên
    console.log("Headers nhận được:", req.headers);

    let token;

    // Kiểm tra header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log("1. Token trích xuất được:", token);

            // Kiểm tra token rỗng
            if(!token || token === 'undefined' || token === 'null') {
                 throw new Error("Token bị rỗng hoặc undefined");
            }

            const secret = process.env.JWT_SECRET;
            console.log(">>> [AUTH DEBUG] Key dùng để CHECK Token:", secret); // <--- THÊM DÒNG NÀY

            const decoded = jwt.verify(token, secret);
            console.log("2. Giải mã thành công. User ID:", decoded.id);

            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                console.log("ERROR: Token hợp lệ nhưng không tìm thấy User trong DB!");
                return res.status(401).json({ message: 'User không tồn tại' });
            }

            console.log("3. Xác thực thành công! Cho phép đi tiếp.");
            console.log("-----------------------------------------\n");
            next();
        } catch (error) {
            console.error("ERROR JWT:", error.message);
            return res.status(401).json({ 
                message: 'Token không hợp lệ: ' + error.message 
            });
        }
    } 
    // Nếu không có header Authorization
    else {
        console.log("ERROR: Không tìm thấy header Authorization hoặc sai định dạng Bearer");
        console.log("Gía trị Authorization nhận được:", req.headers.authorization);
        return res.status(401).json({ message: 'Không có Token' });
    }
};

// --- Middleware kiểm tra quyền Admin ---
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Là admin, cho đi tiếp
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập Admin' }); // Chặn lại
    }
};


module.exports = { protect, adminOnly };