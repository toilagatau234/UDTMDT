import mongoose from "mongoose";

const baocaoSchema = new mongoose.Schema(
    {
        loaiBC: {
            type: String,
        },
        loaiBaoCao: {
            type:String,
        },
        trangThaiBC: {
            type:String,
        },
        phanHoi: {
            type:String,
        },
        nguoiDungIdBC: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Nguoidung",
        }
    },{ timestamps: true }
)

const Baocao = mongoose.model("Baocao", baocaoSchema);

export default Baocao;