import Tinnhan from "../models/tinnhan.model.js"; 
import Thongbao from "../models/thongbao.model.js";
import { getReceiverSocketId, io } from "../server.js"
import Nguoidung from "../models/nguoidung.model.js";

export const layToanBoNguoiDung = async (req, res) => {
  try {
    const loggedInUserId = req.nguoidung._id;
    const filteredUsers = await Nguoidung.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Lỗi ở lấy LayToanBoNguoiDung: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const layTinNhan = async (req, res) => {
    try {
      const { id: nguoidechat } = req.params;
      const idnguoidung = req.nguoidung._id;
  
      const tinnhan = await Tinnhan.find({
        $or: [
          { idNguoiDungGui: idnguoidung, idNguoiDungNhan: nguoidechat },
          { idNguoiDungGui: nguoidechat, idNguoiDungNhan: idnguoidung },
        ],
      });
  
      res.status(200).json(tinnhan);
    } catch (error) {
      console.log("lỗi layTinNhan controller: ", error.message);
      res.status(500).json({ error: "Lỗi 500" });
    }
  };


  export const guiTinNhan = async (req, res) => {
    try {
        const { noiDungTN } = req.body;
        const { id: idNguoiDungNhan } = req.params;
        const idNguoiDungGui = req.nguoidung._id;

       
        const nguoiDungGui = await Nguoidung.findById(idNguoiDungGui).select("tenNguoiDung");
        if (!nguoiDungGui) {
            return res.status(404).json({ error: "Người gửi không tồn tại" });
        }

       
        const tinNhanMoi = new Tinnhan({
            idNguoiDungGui,
            idNguoiDungNhan,
            noiDungTN,
        });

        await tinNhanMoi.save();

        
        const receiverSocketId = getReceiverSocketId(idNguoiDungNhan);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("tinNhanMoi", tinNhanMoi);
        }

        // Tạo thông báo
        const thongbaoMoi = new Thongbao({
            tuNguoiDung: idNguoiDungGui,
            denNguoiDung: idNguoiDungNhan,
            noiDungTB: `Bạn có tin nhắn từ ${nguoiDungGui.tenNguoiDung}`,
            trangThaiXem: false,
        });

        await thongbaoMoi.save();

       
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", thongbaoMoi);
        }

        res.status(201).json({
            message: "Gửi tin nhắn và tạo thông báo thành công",
            tinNhan: tinNhanMoi,
            thongbao: thongbaoMoi,
        });
    } catch (error) {
        console.log("Lỗi guiTinNhan controller: ", error.message);
        res.status(500).json({ error: "Lỗi 500" });
    }
};
