const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const backupChargerSchema = new Schema({
  // _id sản phẩm bên ProductModel
  idProduct: { type: Schema.Types.ObjectId, ref: "product", required: true },

  // màu của sạc
  color: { type: String, trim: true },

  // dung lượng tính theo mAh
  capacityPin: { type: Number, required: true, default: 5000 },

  // Lõi pin : Lithium Polymer
  corePin: { type: String, trim: true },

  // số cổng sạc
  numberOfPort: { type: Number, default: 1, max: 8 },

  // điện áp vao , vd { in: '5V/1A'}
  voltageIn: { type: String, trim: true },

  // điện áp ra, vd { out: '5V/1A, 2A' }
  voltageOut: { type: String, trim: true },

  // Kích thước, vd 138 x 69 x 14 mm
  size: { type: String, trim: true },

  // khối lượng tính theo g
  weightG: { type: Number, default: 0 },

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },

  // các hình ảnh của sản phẩm
  catalogs: [String],

  // bài viết mô tả chi tiết ở DescriptionModel
  details: Schema.Types.ObjectId,
});

const BackupChargerModel = mongoose.model(
  "backupCharger",
  backupChargerSchema,
  "backupChargers"
);

module.exports = BackupChargerModel;
