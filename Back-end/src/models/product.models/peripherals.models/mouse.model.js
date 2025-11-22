const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mouseSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // loại chuột: 0 - có dây, 1 - không dây
  typeConnect: { type: Number, enum: [0, 1], default: 0 },

  // có led hay không
  isLed: { type: Boolean, default: false },

  // Màu sắc: 0 - đen, 1 - bạc, 2 - trắng, 3 - hồng, 4 - đỏ, 5 - xám
  color: { type: Number, enum: [...Array(6).keys()], default: 0 },

  // kết nối : USB 2.0, Wireless
  connect: { type: String, trim: true },

  // Độ phân giải (CPI/DPI)
  resolution: { type: String, trim: true },

  //Dạng cảm biến: 0 - Optical , 1 - laser
  typeSensor: { type: Number, enum: [0, 1], default: 0 },
  
  // Tên cảm biến: vd :PMW3327
  nameSensor: { type: String, trim: true },

  // Số nút bấm : vd : 6
  numOfButton : { type: String, trim: true},

  // Kích thước :
  size: { type: String, trim: true },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const MouseModel = mongoose.model("mouse", mouseSchema, "mouses");

module.exports = MouseModel;
