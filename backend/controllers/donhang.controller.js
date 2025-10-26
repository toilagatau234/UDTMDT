import Donhang from "../models/donhang.model.js";
import Dichvu from "../models/dichvu.model.js";
import Nguoidung from "../models/nguoidung.model.js";
import Danhmuc from "../models/danhmuc.model.js";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const themDonHang = async (req, res) => {
    try {
        const idNguoiDungDH = req.nguoidung._id.toString();

        const { 
            dichVuId, 
            soLuong, 
            phanLoai,
            tongTien
        } = req.body;

        if (!dichVuId || !soLuong || !phanLoai || !tongTien) {
            return res.status(400).json({ error: 'Thiếu thông tin đơn hàng.' });
        }

        const { tenLoai, giaLoai, moTaLoai, thoiGianDuKien } = phanLoai;
        if (!tenLoai || !giaLoai || !moTaLoai || !thoiGianDuKien) {
            return res.status(400).json({ error: 'Thông tin phanLoai không đầy đủ.' });
        }

        const dichVu = await Dichvu.findById(dichVuId);
        if (!dichVu) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại." });
        }

        const nguoiBanId = dichVu.idNguoiDungDV;

        const giaoDichMoi = {
            trangThaiThanhToan: "Chưa thanh toán",
        };

        const donHangMoi = new Donhang({
            dichVuId,
            soLuong,
            phanLoai,
            khachHangId: idNguoiDungDH,
            nguoiBanId: nguoiBanId,
            trangThaiDH: "Chờ xác nhận",
            tongTien,
            giaoDich: giaoDichMoi,
        });

        await donHangMoi.save();

        const khachHang = await Nguoidung.findById(idNguoiDungDH);
            if (!khachHang) {
                return res.status(404).json({ message: "Khách hàng không tồn tại." });
            }

        khachHang.idDonHangND.push(donHangMoi._id); 
        await khachHang.save();

        dichVu.soLuongDonHang.push(donHangMoi._id); 
        await dichVu.save();

        res.status(201).json({ donhangId: donHangMoi._id });
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error.message);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi tạo đơn hàng.",
            error: error.message,
        });
    }
};

export const capNhatGiaoDich = async (req, res) => {
    try {
        const donhangId = req.params.id;

        const donhang = await Donhang.findOne({ _id: new ObjectId(donhangId) });
        if (!donhang) {
            return res.status(404).json({ error: 'Đơn hàng không tìm thấy.' });
        }

        const { maGiaoDich, trangThaiThanhToan, loaiThanhToan, loaiThe, loaiGiaoDich, amount } = req.body;

        if (!maGiaoDich || !trangThaiThanhToan || !loaiThanhToan || !loaiThe || !loaiGiaoDich || !amount) {
            return res.status(400).json({ error: 'Thông tin giaoDich không đầy đủ.' });
        }

        const createdAt = new Date();
        console.log("Created At:", createdAt);
        
        donhang.giaoDich = {
            maGiaoDich,
            trangThaiThanhToan,
            loaiThanhToan,
            loaiThe,
            loaiGiaoDich,
            amount,
            createdAt,
        };

        await donhang.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật giao dịch thành công.',
            donhang,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật giao dịch của đơn hàng:", error.message);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi cập nhật giao dịch.",
            error: error.message,
        });
    }
};

export const layGiaoDich = async (req, res) => {
    try {
        const donhangId = req.params.id;

        const donhang = await Donhang.findOne({ _id: new ObjectId(donhangId) });
        if (!donhang) {
            return res.status(404).json({ error: 'Đơn hàng không tìm thấy.' });
        }

        res.status(200).json(donhang);
    } catch (error) {
        console.error("Lỗi khi lấy giao dịch của đơn hàng:", error.message);

        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy giao dịch.",
            error: error.message,
        });
    }
};

export const layDonHangCuaNguoiBan = async (req, res) => {
    try {
        const nguoiBanId = req.nguoidung._id;
        const { trangThaiDH } = req.params;

        const filter = {
            nguoiBanId: nguoiBanId,
            "giaoDich.trangThaiThanhToan": "Thành công",
        };
        if (trangThaiDH) {
            filter.trangThaiDH = trangThaiDH;
        }
        const donhangs = await Donhang.find(filter)
            .populate("dichVuId")
            .populate("khachHangId")
            .populate({
                path: "dichVuId",
                populate: {
                    path: "idDanhMucDV",
                    model: "Danhmuc"
                }
            });

        if (!donhangs || donhangs.length === 0) {
            return res.status(404).json({ error: 'Không có đơn hàng nào của người bán này.' });
        }

        res.status(200).json(donhangs);
    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng của người bán:", error.message);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy đơn hàng.",
            error: error.message,
        });
    }
};

export const capNhatTrangThai = async (req, res) => {
    try {
        const donhangId = req.params.id;

        const donhang = await Donhang.findOne({ _id: donhangId });
        if (!donhang) {
            return res.status(404).json({ error: 'Đơn hàng không tìm thấy.' });
        }

        const { trangThaiDH } = req.body;

        donhang.trangThaiDH = trangThaiDH;

        await donhang.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật giao dịch thành công.',
            donhang,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật giao dịch của đơn hàng:", error.message);
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi cập nhật giao dịch.",
            error: error.message,
        });
    }
};

export const layDonHangCuaNguoiMua = async (req, res) => {
    try {
        const nguoiMuaId = req.nguoidung._id;
        const { trangThaiDH } = req.params;

        const filter = {
            khachHangId: nguoiMuaId,
            "giaoDich.trangThaiThanhToan": "Thành công",
        };

        if (trangThaiDH) {
            filter.trangThaiDH = trangThaiDH;
        }

        const donhangs = await Donhang.find(filter)
            .populate("dichVuId")
            .populate("nguoiBanId")        
            .populate({
                path: "dichVuId",
                populate: {
                    path: "idDanhMucDV",
                    model: "Danhmuc"
                }
            });

        if (!donhangs || donhangs.length === 0) {
            return res.status(404).json({ error: 'Không có đơn hàng nào của người mua này.' });
        }

        res.status(200).json(donhangs);
    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng của người mua:", error.message);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy đơn hàng.",
            error: error.message,
        });
    }
};

export const layTatCaDonHangCuaNguoiMua = async (req, res) => {
    const idNguoiDung = req.nguoidung._id;
    try {
        const gioHang = await Donhang.find({ khachHangId: idNguoiDung })
            .populate('dichVuId');

        const soLuongDonHang = await Donhang.countDocuments({ khachHangId: idNguoiDung });

        res.status(200).json({ gioHang, soLuongDonHang });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.error("Error in layTatCaDonHangCuaNguoiMua controller", error);
    }
};
