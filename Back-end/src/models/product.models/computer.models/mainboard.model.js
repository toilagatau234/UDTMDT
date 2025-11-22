const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mainboardSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: 'product', required: true },

  // loại chipset: vd 'Z490'
  chipset: { type: String, trim: true, maxlength: 10 },

  // series mainboard: vd 'KHT'
  series: { type: String, trim: true },

  // loại socket: 0 - 1151-v2, 1 - 1200, 2 - AM4, 3 - 1151, 4 - sTRX
  socketType: { type: Number, enum: [...Array(5).keys()], default: 0 },

  // chuẩn kích thước: 0 - Micro-ATX, 1 - ATX, 2 - Extended-ATX, 3 - Mini-ATX, 4 - XL-ATX
  sizeStd: { type: Number, enum: [...Array(5).keys()], default: 0 },

  // Khe RAM tối đa: vd '4' Khe
  maxRam: { type: Number, trim: true },

  // Kiểu RAM hỗ trợ: 0: 'DDR3' , 1: 'DDR4'
  typeRamsub: { type: Number, enum: [0, 1], default: 0 },

  // Hỗ trợ bộ nhớ tối đa: vd '64' GB 
  maxMenmorySub: { type: Number, trim: true },

  // Bus RAM hỗ trợ: vd '2666MHz'
  busRamSub: { type: String, trim: true },

  // Lưu trữ: vd '4 x SATA 3 6Gb/s, 1 x M.2 NVMe'
  storage: { type: String, trim: true },

  // Kiểu khe M.2 hỗ trợ: 0 - M.2 NVMe, 1-M.2 SATA/NVMe
  typeM2Sub: { type: Number, enum: [0, 1], default: 0 },

  // Cổng xuất hình : '1 x HDMI'
  outputPort: { type: String, trim: true },

  // Khe PCI : '1 x PCIe x16'
  slotPCI: { type: String, trim: true },

  // Multi-GPU : AMD CrossFire
  multiGpu : { type: String, trim: true },

  // Đèn LED : RGB
  ledColor : { type: String, trim: true },

  // Số cổng USB : - 1 x USB Type-C (tối đa 2)
  protUsb: { type: String, trim: true },

  // Lan : 1 x LAN 2.5Gb/s
  lan : { type: String, trim: true },

  // Âm thanh: Realtek® Audio codec High Definition Audio2/4/5.1/7.1-channelSupport for S/PDIF Out
  Sound: { type: String, trim: true},

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const MainboardModel = mongoose.model(
  'mainboard', 
  mainboardSchema,
  'mainboards',
);

module.exports = MainboardModel;