const User = require('../models/User.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- ĐĂNG KÝ ---
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- ĐĂNG NHẬP ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

        if (user.isBlocked) {
            return res.status(403).json({ 
                message: 'Tài khoản của bạn đã bị khóa!', 
                status: 'ERR',
                isBlocked: true // Cờ đánh dấu để Frontend nhận biết
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không chính xác' });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: userPassword, ...userData } = user.toObject();
        res.status(200).json({ message: 'Đăng nhập thành công!', token, user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- ĐĂNG NHẬP ADMIN ---
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        // Kiểm tra user tồn tại
        if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

        // Kiểm tra quyền Admin (QUAN TRỌNG)
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập vào trang quản trị!' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không chính xác' });

        // Tạo token chứa role admin
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: userPassword, ...userData } = user.toObject();
        // Trả về token và thông tin admin
        res.status(200).json({ message: 'Admin đăng nhập thành công!', token, user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- LẤY PROFILE ---
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// --- UPDATE PROFILE ---
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = '';
        user.phone = req.body.phone || user.phone;
        user.gender = req.body.gender || user.gender;
        if (req.body.phoneVerified !== undefined) user.phoneVerified = req.body.phoneVerified;
        if (req.body.birthday) user.birthday = new Date(req.body.birthday);

        const updatedUser = await user.save();
        const { password, ...userData } = updatedUser.toObject();
        res.status(200).json({ success: true, message: 'Cập nhật thành công!', data: userData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// --- THÊM ĐỊA CHỈ ---
const addAddress = async (req, res) => {
    try {
        const { province, district, ward, specificAddress, isDefault } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({ province, district, ward, specificAddress, isDefault: isDefault || false });
        await user.save();

        res.status(200).json({ success: true, message: 'Thêm địa chỉ thành công!', data: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- SỬA ĐỊA CHỈ ---
const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { province, district, ward, specificAddress, isDefault } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        const addressToUpdate = user.addresses.id(id);
        if (!addressToUpdate) return res.status(404).json({ message: 'Không tìm thấy địa chỉ này' });

        if (isDefault) {
            user.addresses.forEach(addr => {
                if (addr._id.toString() !== id) addr.isDefault = false;
            });
        }

        addressToUpdate.province = province || addressToUpdate.province;
        addressToUpdate.district = district || addressToUpdate.district;
        addressToUpdate.ward = ward || addressToUpdate.ward;
        addressToUpdate.specificAddress = specificAddress || addressToUpdate.specificAddress;
        addressToUpdate.isDefault = isDefault;

        await user.save();
        res.status(200).json({ success: true, message: 'Cập nhật địa chỉ thành công!', data: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- XÓA ĐỊA CHỈ ---
const removeAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const updateResult = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { addresses: { _id: id } } },
            { new: true }
        ).select('-password');

        if (!updateResult) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

        return res.status(200).json({ success: true, message: 'Xóa địa chỉ thành công', data: updateResult.addresses });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// --- YÊU THÍCH ---
const getWishlist = async (req, res) => { 
    try { 
        const user = await User.findById(req.user.id).populate('wishlist'); 
        res.status(200).json({ success: true, wishlist: user.wishlist }); 
    } catch (error) { 
        res.status(500).json({ message: 'Lỗi server' }); 
    } 
};
const addToWishlist = async (req, res) => { 
    try { 
        const { productId } = req.body; 
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { wishlist: productId } },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Đã thêm vào yêu thích' }); 
    } catch (error) { 
        res.status(500).json({ message: 'Lỗi server' }); 
    } 
};
const removeFromWishlist = async (req, res) => { 
    try { 
        const { productId } = req.params; 
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { wishlist: productId } },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Đã xóa khỏi yêu thích' }); 
    } catch (error) { 
        res.status(500).json({ message: 'Lỗi server' }); 
    } 
};

// --- QUẢN LÝ GIỎ HÀNG (MỚI) ---
const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItems } = req.body;
        const user = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
        res.status(200).json({ success: true, message: 'Cập nhật giỏ hàng thành công', cartItems: user.cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, cartItems: user.cartItems || [] });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- [ADMIN] LẤY DANH SÁCH USER (Phân trang & Tìm kiếm) ---
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        // Tạo bộ lọc tìm kiếm
        const query = {
            role: { $ne: 'admin' }, // Không lấy tài khoản admin
            $or: [
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ]
        };

        const totalUsers = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password') // Không trả về mật khẩu
            .sort({ createdAt: -1 }) // User mới nhất lên đầu
            .skip((page - 1) * limit)
            .limit(limit);

        // Map dữ liệu để khớp với Frontend (cần fullname)
        const formattedUsers = users.map(user => ({
            _id: user._id,
            fullname: `${user.lastName || ''} ${user.firstName}`.trim(),
            email: user.email,
            phone: user.phone,
            role: user.role,
            isBlocked: user.isBlocked, // Đã thêm ở Bước 1
            avatar: user.avatar
        }));

        res.status(200).json({
            users: formattedUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers
        });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- [ADMIN] KHÓA / MỞ KHÓA USER ---
const toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body;

        const user = await User.findByIdAndUpdate(
            id, 
            { isBlocked: isBlocked }, 
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        res.status(200).json({ message: 'Cập nhật trạng thái thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- [ADMIN] XÓA USER ---
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra xem user có tồn tại không
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        // Không cho phép xóa Admin
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Không thể xóa tài khoản Admin' });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'Xóa user thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- [ADMIN] TẠO USER MỚI ---
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName, 
            lastName, 
            email, 
            password: hashedPassword, 
            phone, 
            role: role || 'customer' // Admin có thể set role ngay lúc tạo
        });

        res.status(201).json({ 
            status: 'OK', 
            message: 'Tạo người dùng thành công', 
            data: newUser 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- [ADMIN] LẤY CHI TIẾT USER THEO ID ---
const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); // Không trả về password
        
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        
        res.status(200).json({ status: 'OK', data: user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// --- [ADMIN] CẬP NHẬT USER ---
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        // Nếu admin muốn đổi password cho user
        if (data.password) {
             const salt = await bcrypt.genSalt(10);
             data.password = await bcrypt.hash(data.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true }).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        res.status(200).json({ 
            status: 'OK', 
            message: 'Cập nhật thành công', 
            data: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const forgotPassword = async (req, res) => { res.status(501).json({ message: "Chức năng đang bảo trì" }); };
const resetPassword = async (req, res) => { res.status(501).json({ message: "Chức năng đang bảo trì" }); };

module.exports = {
    registerUser, loginUser,loginAdmin,
    getUserProfile, updateUserProfile,
    forgotPassword, resetPassword, getWishlist, addToWishlist, removeFromWishlist,
    addAddress, updateAddress, removeAddress,
    updateCart, getCart,
    getAllUsers,
    toggleBlockUser,
    deleteUser,
    createUser, getDetailsUser, updateUser,

};