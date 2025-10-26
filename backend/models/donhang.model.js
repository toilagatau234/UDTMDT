import mongoose from "mongoose";

const donhangSchema = new mongoose.Schema(
    {
        trangThaiDH:{
            type: String,
        },
        tongTien:{
            type: Number,
        },
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
        },
        khachHangId: {
            type: mongoose.Schema.Types.ObjectId,
			ref: "Nguoidung",
        },
        nguoiBanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Nguoidung",
        },
        danhGia: { 
            type: Boolean, 
            default: false,
        },
        giaoDich: {
            maGiaoDich: { type: Number },
            trangThaiThanhToan: { type: String },
            loaiThanhToan: { type: String },
            loaiThe: { type: String },
            loaiGiaoDich: { type: String },
            createdAt: { type: Date },
        },
    },
    { timestamps: true } 
);

const Donhang = mongoose.model("Donhang", donhangSchema, "Donhang");

export default Donhang;
