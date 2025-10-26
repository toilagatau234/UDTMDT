import mongoose from "mongoose";

const nguoidungSchema = new mongoose.Schema(
    {
        tenNguoiDung: {
			type: String,
            required: true,
            unique: true,
		},
        email: {
			type: String,
            required: true,
            unique: true,
		},
        matKhau: {
			type: String,
            required: true,
            minLength: 6,
		},
        diaChi: {
			type: String,
		},
        soDienThoai: {
			type: String,
		},
        vaiTro: {
			type: String,
		},
        anhND: {
			type: String,
		},
        moTaND: {
			type: String,
		},
        idDichVuND: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Dichvu",
				default: [],
			},
		],
        idDonHangND: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Donhang",
				default: [],
			},
		],
        danhSachYeuThich: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Dichvu",
				default: [],
			},
		],
		soDu: [
            {
                nguoiGiaoDich: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Nguoidung",
                    required: true,
                },
                soTienGiaoDich: {
                    type: Number,
                    required: true,
                },
				dongTien: {
					type: String,
					required: true,
				},
				noiDungGiaoDich: {
                    type: String,
                    required: true,
                },
                ngayGiaoDich: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    }
)

const Nguoidung = mongoose.model("Nguoidung", nguoidungSchema,"Nguoidung");

export default Nguoidung;