import mongoose from "mongoose";

const giohangSchema = new mongoose.Schema(
    {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Nguoidung",
            required: true,
        },
        dichVu:
        {
            dichVuId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Dichvu",
            },
            phanLoai: {
                tenLoai: { type: String },
                giaLoai: { type: Number },
                moTaLoai: { type: String },
                thoiGianDuKien: { type: String },
            },
            soLuong: {
                type: Number,
                default: 1,
            },
            _id: false,
        },
    },
);

const Giohang = mongoose.model("Giohang", giohangSchema, "Giohang");

export default Giohang;
