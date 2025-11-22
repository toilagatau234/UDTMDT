const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const displaySchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // nhà sản xuất chipset: 0 - NVIDIA, 1 - AMD
  manufacturer: { type: Number, enum: [0, 1], default: 0 },

  // dung lượng tính theo GB
  capacity: { type: Number, required: true, default: 1 },

  // GPU : 'GeForce GTX 1660 Super'
  gpu: { type: String, trim: true },

  // GPU clock:
  gpuLock: { type: String, trim: true },

  // Bộ nhớ : '6GB GDDR6 ( 14 Gbps / 192-bit )'
  memory: { type: String, trim: true },

  // Giao tiếp PCI: 0 - PCI Express 3.0, 1 - PCI Express 4.0
  pci: { type: Number, enum: [0, 1], default: 0 },

  // Số lượng đơn vị xử lý (CUDA)
  processor: { type: Number, trim: true },

  //Cổng kết nối '1 x HDMI 2.0b'
  connector: { type: String, trim: true },

  // Tản nhiệt '1'
  radiators: { type: Number, default: 2 },

  // Đén Led
  isLed: { type: String, trim: true },

  // VR : 0 : hổ trọ , 1 Không hổ trọ
  vr: { type: Number, enum: [0, 1] },

  // Nguồn đề xuát : vd 300W
  suggestVoltage: { type: String, required: true },

  // Kích thước
  size: { type: String, required: true },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const DisplayModel = mongoose.model("display", displaySchema, "displays");

module.exports = DisplayModel;
