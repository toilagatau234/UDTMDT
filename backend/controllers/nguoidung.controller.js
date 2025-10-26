import Nguoidung from "../models/nguoidung.model.js"
import Dichvu from '../models/dichvu.model.js'
import {v2 as cloudinary} from 'cloudinary'

export const formDangKy = async (req, res) => {
    try {
        const { soDienThoai, diaChi } = req.body;
        const id = req.nguoidung._id.toString();

        const nguoidung = await Nguoidung.findOne({ _id: id });

        if (!nguoidung) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        if (nguoidung.vaiTro === "freelancer") {
            return res.status(400).json({ message: "Bạn đã đăng ký là freelancer rồi." });
        }

        nguoidung.soDienThoai = soDienThoai;
        nguoidung.diaChi = diaChi;
        nguoidung.vaiTro = "freelancer"; 
        await nguoidung.save();

        return res.status(201).json({
            message: "Đăng ký thành freelancer thành công",
            user: {
                tenNguoiDung: nguoidung.tenNguoiDung,
                email: nguoidung.email,
                vaiTro: nguoidung.vaiTro,
                soDienThoai: nguoidung.soDienThoai,
                diaChi: nguoidung.diaChi,
            },
        });
    } catch (error) {
        console.log("Lỗi ", error.message);
        return res.status(500).json({ error: "Lỗi 500" });
    }
};

export const layTheoId = async (req, res) => {
    const { id } = req.params; 
    try {
        const nguoidung = await Nguoidung.findById(id);
        return res.status(200).json(nguoidung);
    } catch (error) {
        res.status(500).json({ error: "Lỗi 500" });
        console.log("Lỗi layTheoId controller", error.message);
    }
}

export const capNhat = async (req, res) => {
    const { tenNguoiDung, email, diaChi, soDienThoai } = req.body;
    let { anhND } = req.body; 

    const id = req.nguoidung._id;
    try {
        let nguoidung = await Nguoidung.findById(id);
        if (!nguoidung) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        if (anhND) {
        
            if (nguoidung.anhND) {
                await cloudinary.uploader.destroy(nguoidung.anhND.split("/").pop().split(".")[0]);
            }
        
            const uploadedResponse = await cloudinary.uploader.upload(anhND);
            anhND = uploadedResponse.secure_url;
        }

        nguoidung.tenNguoiDung = tenNguoiDung || nguoidung.tenNguoiDung;
        nguoidung.email = email || nguoidung.email;
        nguoidung.diaChi = diaChi || nguoidung.diaChi;
        nguoidung.soDienThoai = soDienThoai || nguoidung.soDienThoai;
        nguoidung.anhND = anhND || nguoidung.anhND;

        nguoidung = await nguoidung.save();

        return res.status(200).json({ nguoidung });
    } catch (error) {
        console.log("Lỗi capNhat controller:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const yeuThich = async (req, res) => {
    try {   
        const idDV = req.params.id; 
        const idND = req.nguoidung._id;
        const nguoiDung = await Nguoidung.findById(idND);
        if (!nguoiDung) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const index = nguoiDung.danhSachYeuThich.indexOf(idDV);
        if (index === -1) {
            nguoiDung.danhSachYeuThich.push(idDV);
        } else {
            nguoiDung.danhSachYeuThich.splice(index, 1);
        }
        await nguoiDung.save();

        return res.status(200).json({
            message: index === -1 ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích",
            danhSachYeuThich: nguoiDung.danhSachYeuThich,
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi 500" });
        console.log("Lỗi yêu thích controller", error.message);
    }
};

export const layYeuThich = async (req, res) => {
    try {   
        const idND = req.nguoidung._id;
        const { page = 1, limit = 4 } = req.query;
        const pageSize = parseInt(limit);
        const skip = (page - 1) * pageSize;

        const nguoiDung = await Nguoidung.findById(idND)
        .populate({
            path: "danhSachYeuThich",
            populate: {
                path: "idNguoiDungDV",
                select: "tenNguoiDung anhND"
            }
        });

        if (!nguoiDung) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const danhSachYeuThich = nguoiDung.danhSachYeuThich;
        const tong = danhSachYeuThich.length;
        const tongPage = Math.ceil(tong / pageSize);

        const danhSachYeuThichPaginized = danhSachYeuThich.slice(skip, skip + pageSize);

        return res.status(200).json({
            danhSachYeuThich: danhSachYeuThichPaginized,
            tong,
            tongPage
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi 500" });
        console.log("Lỗi yêu thích controller", error.message);
    }
};

export const capNhatSoDu = async (req, res) => {
    const { nguoiGiaoDich, soTienGiaoDich, dongTien, noiDungGiaoDich, idNguoiBan } = req.body;

    try {
        const nguoiDung = await Nguoidung.findById(idNguoiBan);

        if (!nguoiDung) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const soTienGiaoDichMoi = soTienGiaoDich * 90 / 100;

        const giaoDichMoi = {
            nguoiGiaoDich,
            soTienGiaoDich: soTienGiaoDichMoi,
            dongTien,
            noiDungGiaoDich,
            ngayGiaoDich: new Date(),
        };

        nguoiDung.soDu.push(giaoDichMoi);

        await nguoiDung.save();

        return res.status(200).json({ message: 'Cập nhật số dư thành công', soDu: nguoiDung.soDu });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật số dư' });
    }
};

export const layGiaoDich = async (req, res) => {
    const id = req.nguoidung._id;

    try {
        const nguoiDung = await Nguoidung.findById(id);

        if (!nguoiDung) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        let tongTien = 0;

        for (let giaoDich of nguoiDung.soDu) {
            if (giaoDich.dongTien === 'Cộng') {
                tongTien += giaoDich.soTienGiaoDich;
            }
            else if (giaoDich.dongTien === 'Trừ') {
                tongTien -= giaoDich.soTienGiaoDich;
            }
        }

        const danhSachGiaoDich = nguoiDung.soDu.sort((a, b) => new Date(b.ngayGiaoDich) - new Date(a.ngayGiaoDich));

        return res.status(200).json({ message: 'Lấy giao dịch thành công', tongTien, danhSachGiaoDich });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy giao dịch' });
    }
};

export const capNhatSoDuRutTien = async (req, res) => {
    const id = req.nguoidung._id;
    const { soTienGiaoDich, dongTien, noiDungGiaoDich } = req.body;

    try {
        const nguoiDung = await Nguoidung.findById(id);

        if (!nguoiDung) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const giaoDichMoi = {
            nguoiGiaoDich: id,
            soTienGiaoDich,
            dongTien,
            noiDungGiaoDich,
            ngayGiaoDich: new Date(),
        };

        nguoiDung.soDu.push(giaoDichMoi);

        await nguoiDung.save();

        return res.status(200).json({ message: 'Cập nhật số dư thành công', soDu: nguoiDung.soDu });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật số dư' });
    }
};


export const layHet = async (req, res) => {
    try {
        
        const nguoiDungList = await Nguoidung.find(); 

        
        if (!nguoiDungList || nguoiDungList.length === 0) {
            return res.status(404).json({ error: "Không có người dùng nào." });
        }

        
        return res.status(200).json(nguoiDungList);
    } catch (error) {
        console.log("Lỗi layHet controller:", error.message);
        res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng." });
    }
};



export const layTheoRole = async (req, res) => {
    try {
        const { role } = req.query; 

        if (!role) {
            return res.status(400).json({ error: "Vai trò không được cung cấp." });
        }

      
        const nguoiDungList = await Nguoidung.find({ vaiTro: role });

        if (!nguoiDungList || nguoiDungList.length === 0) {
            return res.status(404).json({ error: `Không có người dùng với vai trò ${role}.` });
        }

        return res.status(200).json(nguoiDungList);
    } catch (error) {
        console.log("Lỗi layTheoRole controller:", error.message);
        res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng theo vai trò." });
    }
};



export const voHieuHoa = async (req, res) => {
    try {
        const { id } = req.params; 


        const nguoidung = await Nguoidung.findById(id);

 
        if (!nguoidung) {
            return res.status(404).json({ error: "Không tìm thấy người dùng." });
        }

   
        nguoidung.vaiTro = 'blocked';

   
        await nguoidung.save();

        return res.status(200).json({
            message: "Người dùng đã bị khóa.",
            nguoidung: {
                tenNguoiDung: nguoidung.tenNguoiDung,
                email: nguoidung.email,
                vaiTro: nguoidung.vaiTro, 
            },
        });
    } catch (error) {
        console.log("Lỗi voHieuHoa controller:", error.message);
        res.status(500).json({ error: "Lỗi khi vô hiệu hóa người dùng." });
    }
};

export const traLaiQuyen = async (req, res) => {
    const { id } = req.params;  

    try {
       
        const nguoidung = await Nguoidung.findById(id);

      
        if (!nguoidung) {
            return res.status(404).json({ error: "Không tìm thấy người dùng." });
        }

   
        const isFreelancer = nguoidung.idDichVuND && nguoidung.idDichVuND.length > 0;

  
        nguoidung.vaiTro = isFreelancer ? 'freelancer' : 'user';

      
        await nguoidung.save();

        return res.status(200).json({
            message: "Quyền của người dùng đã được khôi phục.",
            user: nguoidung
        });

    } catch (error) {
        console.log("Lỗi traLaiQuyen controller:", error.message);
        res.status(500).json({ error: "Lỗi khi trả lại quyền người dùng." });
    }
};
