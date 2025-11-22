const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true },
});

const CategoryModel = mongoose.model("category", categorySchema, "categories");

module.exports = CategoryModel;
