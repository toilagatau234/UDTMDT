import Giohang from "../models/giohang.model.js"
import Nguoidung from "../models/nguoidung.model.js";

export const layGioHang = async (req, res) => {
    const idNguoiDung =  req.nguoidung._id.toString();
    try {
        const gioHang = await Giohang.findById(idNguoiDung);
        res.status(200).json(gioHang);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.error("Error in layGioHang controller", error);
    }
};

export const themDichVuVaoGioHang = async (req, res) => {
    try {
        const id = req.nguoidung._id.toString();
        const { dichVuId, phanLoai, soLuong } = req.body;

        if (!dichVuId || !soLuong || !phanLoai) {
            return res.status(400).json({ message: "Cần cung cấp ID dịch vụ, phân loại và số lượng" });
        }

        const nguoiDung = await Nguoidung.findById(id);
        if (nguoiDung && nguoiDung.vaiTro === 'blocked') {
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa, không thể thêm dịch vụ vào giỏ hàng." });
        }

        let giohang = await Giohang.findOne({ _id: id });

        if (!giohang) {
            giohang = new Giohang({
                _id: id,
                dichVu: {
                    dichVuId,
                    phanLoai: {
                        tenLoai: phanLoai.tenLoai,
                        giaLoai: phanLoai.giaLoai,
                        moTaLoai: phanLoai.moTaLoai,
                        thoiGianDuKien: phanLoai.thoiGianDuKien
                    },
                    soLuong
                }
            });
        } else {
            const kiemtra = 
            giohang.dichVu.dichVuId.toString() === dichVuId &&
            giohang.dichVu.phanLoai.tenLoai === phanLoai.tenLoai &&
            giohang.dichVu.phanLoai.giaLoai === phanLoai.giaLoai &&
            giohang.dichVu.phanLoai.moTaLoai === phanLoai.moTaLoai &&
            giohang.dichVu.phanLoai.thoiGianDuKien === phanLoai.thoiGianDuKien;

            if (!kiemtra) {
                giohang.dichVu.dichVuId = dichVuId;
                giohang.dichVu.phanLoai = {
                    tenLoai: phanLoai.tenLoai,
                    giaLoai: phanLoai.giaLoai,
                    moTaLoai: phanLoai.moTaLoai,
                    thoiGianDuKien: phanLoai.thoiGianDuKien
                };
                giohang.dichVu.soLuong = soLuong;
            }
        }

        await giohang.save();

        res.status(201).json(giohang);

    } catch (error) {
        console.log("Lỗi themDichVuVaoGioHang controller", error.message);
        return res.status(500).json({ error: "Lỗi 500" });
    }
};

export const capNhatSoLuong = async (req, res) => {
    try {
        const id = req.nguoidung._id.toString();
        const { dichVuId, soLuong } = req.body;

        if (!dichVuId || !soLuong) {
            return res.status(400).json({ message: "Cần cung cấp ID dịch vụ và số lượng mới" });
        }

        let giohang = await Giohang.findOne({ _id: id });

        if (!giohang) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        if (giohang.dichVu.dichVuId.toString() !== dichVuId) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại trong giỏ hàng" });
        }

        giohang.dichVu.soLuong = soLuong;

        await giohang.save();

        res.status(200).json(giohang);
    } catch (error) {
        console.error("Lỗi capNhatSoLuong controller", error.message);
        return res.status(500).json({ error: "Lỗi 500" });
    }
};
