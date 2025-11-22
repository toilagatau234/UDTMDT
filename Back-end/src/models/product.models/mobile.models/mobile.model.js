const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mobileSchema = new Schema({
  idProduct: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  color: { type: String, trim: true },
  typeScreen: {type: String, trim: true},
  resolution: {type: String, trim: true},
  cameras: {
    before: { type: String, trim: true },
    after: { type: String, trim: true },
  },
  cpu: { type: String, trim: true },
  // displaySize: { type: String, trim: true },
  operating: { type: Number, enum: [0, 1], required: true, default: 0 },
  rom: { type: Number, required: true },
  ram: { type: Number, required: true },
  pin: { type: String, trim: true },
  //  0 - USB Type-C, 1 -Lightning , 2- Micro USB
  chargeGate: { type: Number, enum: [0, 1, 2], default: 0},
  size: {type : String, trim: true},
  catalogs: [String],

  // thời gian bảo hành tính theo tháng
  warranty: { type: Number, default: 0 },
  details: Schema.Types.ObjectId,
});

const MobileModel = mongoose.model('mobile', mobileSchema, 'mobiles');

module.exports = MobileModel;