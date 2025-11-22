const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cpuSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // CPU : Pentium Gold G6405
  cpu: { type: String, trim: true },

  // Series Pentium
  series: { type: String, trim: true },

  // loại socket: 1200
  socketType: { type: String, trim: true },

  // Số nhân xử lý : 2
  multiplier: { type: Number, trim: true },

  // Số luồng xử lý : 4
  processingFlow: { type: Number, trim: true },

  // Thế hệ :  Intel Pentium Gold
  generation: { type: String, trim: true },

  // Tốc độ xử lý : 3.70 GHz - 4.80 GHz
  processingSpeed: { type: String, trim: true },

  // Cache : 64MB
  cache: { type: Number, trim: true },

  // Chip đồ họa
  graphicsChip: { type: String, trim: true },

  //TDP : 58W
  tdp: { type: Number, trim: true },

  // Hyper-Threading : Có
  hyperThreading: { type: String, trim: true },

  //Bộ nhớ hỗ trợ : DDR4
  memorySub: { type: String, trim: true },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const CpuModel = mongoose.model("cpu", cpuSchema, "cpus");

module.exports = CpuModel;
