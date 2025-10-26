import mongoose from "mongoose";

const tinnhanSchema = new mongoose.Schema(
	{
		idNguoiDungGui: {
			type: mongoose.Schema.Types.ObjectId,
            ref: "Nguoidung",
			required: true,
		},
        idNguoiDungNhan: {
			type: mongoose.Schema.Types.ObjectId,
            ref: "Nguoidung",
			required: true,
		},
        noiDungTN: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Tinnhan = mongoose.model("Tinnhan", tinnhanSchema,"Tinnhan");

export default Tinnhan;