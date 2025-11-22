const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Note: 1 record đơn hàng chỉ có 1 sản phẩm
const orderDetailSchema = new Schema({
  // chủ đơn hàng
  orderId: { type: Schema.Types.ObjectId, required: true, ref: "order2" },

  // sản phẩm lúc mua
  orderProd: {
    id: { type: Schema.Types.ObjectId, required: true, ref: "product" },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
  },

  // số lượng
  numOfProd: { type: Number, required: true, default: 1 },
});

const OrderDetailModel = mongoose.model("orderDetail", orderDetailSchema, "orderDetails");

module.exports = OrderDetailModel;
