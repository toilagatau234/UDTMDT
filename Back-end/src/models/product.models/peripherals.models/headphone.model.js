const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const headphoneSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // kiểu tai nghe 0 - Over-ear, 1 - In-ear, 2 - On-ear, 3 - KHT
  type: {
    type: Number,
    enum: [...Array(4).keys()],
    required: true,
    default: 0,
  },

  // Màu sắc: 0 - đen, 1 - bạc, 2 - trắng, 3 - hồng, 4 - đỏ, 5 - xám, 6 - xanh, 7 - vàng
  color: { type: Number, enum: [...Array(8).keys()], default: 0 },

  // chuẩn kết nối
  // 0 - 3.5mm, 1 - bluetooth, 2 - USB, 3 - Bluetooth 4.0, 4 - bluetooth 5.0, 5 - 2.4 GHz Wireless, 6 - USB Type-C
  // connectionStd: { type: Number, enum: [...Array(7).keys()], default: 0 },
  connect: { type: String, trim: true },

  // Loại kết nối : 0 - Tai nghe không dây, 1 - tai nghe có dây
  typeConnect: { type: Number, enum: [0, 1], default: 0 },

  // Đén led : RGB
  isLed: { type: String, trim: true },

  // Microphone : 0 - Không, 1- có
  microphone: { type: Number, enum: [0, 1], default: 0 },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const HeadphoneModel = mongoose.model(
  "headphone",
  headphoneSchema,
  "headphones"
);

module.exports = HeadphoneModel;
