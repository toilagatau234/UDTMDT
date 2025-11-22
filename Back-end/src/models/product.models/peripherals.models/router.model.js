const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routerSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // băng thông: 0 - '2.4 GHz', 1 - '2.4 GHz/5 GHz', 2 - 2.5 GHz / 5 GHz
  bandwidth: { type: Number, enum: [...Array(3).keys()], default: 0 },

  // độ mạnh của ăng ten tính theo dBi
  strong: { type: Number, default: 2 },

  // Chuẩn kết nối : 802.11 b/g/n/ac
  connectionStd: { type: String, trim: true },

  // cổng kết nối: '1xWAN Gigabit'
  numberOfPort: { type: String, trim: true },

  // Ăng tên vd : 3x ngoài
  Antenna: { type: String, trim: true },

  // Tốc độ : vd : 2.4GHz - 450Mbps
  speed: { type: String, trim: true },

  // CPU/RAM/Flash vd :/ RAM 512MB / Flash 256MB
  cpuRamFlash: { type: String, trim: true },

  // Nguồn điện cấp: vd 12V DC / 1.5A
  voltage: { type: String, trim: true },

  //Phụ kiện đi kèm : vd :Router Wi-Fi băng tần kép công suất cao AC1350 Cáp Ethernet RJ45 Bộ chuyển đổi nguồn Hướng dẫn cài đặt nhanh
  accessories: { type: String, trim: true },

  // tính năng khác: 
  otherFunc : { type: String, trim: true },

  // Kích thước
  size: { type: String, trim: true },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const RouterModel = mongoose.model("router", routerSchema, "routers");

module.exports = RouterModel;
