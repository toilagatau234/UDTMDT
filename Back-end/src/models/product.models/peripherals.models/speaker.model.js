const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const speakerSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // Màu sắc: 0 - đen, 1 - bạc, 2 - trắng, 3 - hồng, 4 - đỏ, 5 - xám, 6 - xanh, 7 - vàng , 8 - cam
  color: { type: Number, enum: [...Array(9).keys()], default: 0 },

  // công suất tổng tính theo W
  wattage: { type: Number, default: 3 },

  // Lọai kết nối của loa: Vd : loa không dây
  typeConnect: { type: String, trim: true },

  //  cổng kết nối
  connectionPort: { type: String, default: "3.5 mm", trim: true },

  // kiểu pin : vd Pin Lithium
  typePin: { type: String, trim: true },

  // Tần số phản hồi : vd : 60Hz–20kHz
  fbfrequency: { type: String, trim: true },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // tính năng khác:
  otherFunc: { type: String, trim: true },

  // Kích thước
  size: { type: String, trim: true },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const SpeakerModel = mongoose.model("speaker", speakerSchema, "speakers");

module.exports = SpeakerModel;
