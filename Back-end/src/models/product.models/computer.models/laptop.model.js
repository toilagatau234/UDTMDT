const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const laptopSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },

  color: { type: String, trim: true },

  // chi tiết về cpu
  cpu: {
    //vd: Intel
    // chipBrand: { type: String, trim: true },
    //Thế hệ Cpu :
    generationCpu: { type: String, trim: true },
    // processorCount: { type: Number, default: 1 },
    // 0 - core i3, 1 - core i5, 2 - core i7, 3 - core i9,
    // 4 - Ryzen 3, 5 - Ryzen 5, 6 - Ryzen 7, 7 - Pentium, 8 - Celeron
    // series: { type: Number, enum: [...Array(9).keys()], default: 0 },
    // 9750H up to 4.5 GHz
    detailCpu: { type: String, trim: true },
  },

  // độ phần giải màn hình: 15.6" (1920 x 1080), 60Hz
  displaySize: { type: String, trim: true },

  // card màn hình: NVIDIA GeForce RTX 2080 Super 8GB GDDR6
  display: { type: String, trim: true },

  // dung lượng ổ cứng: 1TB SSD M.2 NVMe
  disk: { type: String, trim: true },

  // dung lượng RAM: 2 x 16GB DDR4 2933MHz
  ram: { type: String, trim: true },

  //kiểu khe M.2 hỗ trợ : vd : M.2 SATA/NVMe
  typeM2Sub: { type: String, trim: true },

  //Cổng xuất hình: vd : 1 x HDMI
  outputPort: { type: String, trim: true },

  //Cổng kết nối : 1 x USB Type C
  connectionPort: { type: String, trim: true },

  // Kết nối không dây : vd WiFi 802.11ac , Bluetooth 4.2
  connectWireless: { type: String, trim: true },

  // hệ điều hành: Windows 10 Home 64-bit
  operating: { type: String, trim: true },

  // Bàn phím : thường , không phím số , LED
  keyborad: { type: String, trim: true },

  // pin: 4 cell 84 Wh Pin liền
  pin: { type: String, trim: true },

  // Kích thước : 39.4 x 26.4 x 1.99 cm
  size: { type: String, trim: true },

  //khối lượng: 2.1 kg
  weight: { type: Number, default: 0 },

  // các hình ảnh sản phẩm
  catalogs: [String],

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // bài viết chi tiết về sản phẩm
  details: Schema.Types.ObjectId,
});

const LaptopModel = mongoose.model("laptop", laptopSchema, "laptops");

module.exports = LaptopModel;
