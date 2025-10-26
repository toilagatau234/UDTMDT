import Thongbao from "../models/thongbao.model.js"

export const layThongBao = async(req,res)=>{
try{
const idnguoidung = req.nguoidung._id

const thongbao = await Thongbao.find({ denNguoiDung:idnguoidung }).populate({
    path:"tuNguoiDung",
    select: "tenNguoiDung ",
})

await Thongbao.updateMany({denNguoiDung:idnguoidung},{trangThaiXem: true})

res.status(200).json(thongbao)
} catch(error) {
console.log("Lỗi layThongBao controller", error.message)
res.status(500).json({ error: "Lỗi 500 "})
}
}

export const xoaThongBao = async (req, res) => {
    try {
        const { id } = req.params;
        const idnguoidung = req.nguoidung._id;

        const result = await Thongbao.deleteOne({ _id: id, denNguoiDung: idnguoidung });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông báo cần xóa." });
        }

        res.status(200).json({ message: "Xóa thông báo thành công." });
    } catch (error) {
        console.error("Lỗi xoaThongBao controller", error.message);
        res.status(500).json({ error: "Lỗi server" });
    }
};
