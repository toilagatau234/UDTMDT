const CategoryModel = require("../models/product.models/category.model");
const ProductModel = require("../models/product.models/product.model");

const getCategories = async (req, res) => {
  try {
    const data = await CategoryModel.find();
    // Luôn trả về data, kể cả khi mảng rỗng
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await CategoryModel.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: "Danh mục này đã tồn tại." });
    }

    const newCategory = new CategoryModel({ name });
    await newCategory.save();

    return res.status(200).json({ msg: "Tạo danh mục thành công" });
  } catch (error) {
    // SỬA LỖI QUAN TRỌNG: Phải trả về lỗi, không được để catch rỗng
    return res.status(500).json({ msg: "Lỗi server", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.query;
    // const category = await ProductModel.findOne({category: id})
    // if(category) return res.status(400).json({msg: "Please delete all products with relationship"})

    const response = await CategoryModel.findById(id);
    if (response) {
      await CategoryModel.deleteOne({ _id: id });
      return res.status(200).json({ msg: "Xoá danh mục thành công" });
    } else {
        return res.status(404).json({ msg: "Không tìm thấy danh mục" });
    }

  } catch (err) {
    return res.status(409).json({ message: "Xoá danh mục sản phẩm thất bại" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = req.body;
    const { _id, ...rest } = category;
    const result = await CategoryModel.updateOne(
      { _id: category._id },
      { ...rest }
    );
    if (result) {
      return res.status(200).json({ message: "Cập nhật thành công" });
    }
  } catch (err) {
    console.error(err);
    return res.status(409).json({ message: "Cập nhật thất bại" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};