import mongoose from "mongoose";
const thongbaoSchema = new mongoose.Schema(
    {
    tuNguoiDung: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nguoidung',
        required: true
    },
    denNguoiDung: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nguoidung',
        required: true
    },
    noiDungTB: { 
        type: String,
    },
    trangThaiXem: {
        type: Boolean,
        default: false
    }
},{ timestamps: true }
);


const Thongbao = mongoose.model("Thongbao", thongbaoSchema,"Thongbao");

export default Thongbao;
