import mongoose from "mongoose";

const dichvuSchema = new mongoose.Schema(
    {
        tenDichVu: {
            type: String,
            required: true,
        },
        moTaDV: {
            type: String,
            required: true,
        },
        kyNang: [
            {
                type: String,
            },
        ],
        phanLoai: {
            coban: {
                tenLoai: { type: String },
                giaLoai: { type: Number },
                moTaLoai: { type: String },
                thoiGianDuKien: { type: String },
            },
            thuong: {
                tenLoai: { type: String },
                giaLoai: { type: Number },
                moTaLoai: { type: String },
                thoiGianDuKien: { type: String },
            },
            nangcao: {
                tenLoai: { type: String },
                giaLoai: { type: Number },
                moTaLoai: { type: String },
                thoiGianDuKien: { type: String },
            },
        },
        trangThaiDV: {
            type: String,
            required: true,
        },
        anhDichVu:{
            type: String,
        },
        idDanhMucDV: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Danhmuc",
            required: true,
        },
        idNguoiDungDV: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Nguoidung",
            required: true,
        },
        danhSachDanhGia: [
            {
                soSao: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
                noiDung: {
                    type: String,
                    required: true,
                },
                idNguoiDungDG: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Nguoidung",
                    required: true,
                },
                ngayDanhGia: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        soLuongDonHang: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DonHang",
                default: [],
            },
        ],
        luotXem: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Dichvu = mongoose.model("Dichvu", dichvuSchema, "Dichvu");

export default Dichvu;
