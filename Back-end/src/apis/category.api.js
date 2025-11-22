const categoryApi = require("express").Router();
const categoryController = require("../controllers/category.controller");

// api: Lấy danh sách danh mục của 1 sản phẩm
categoryApi.get("/", categoryController.getCategories);

// api: Thêm 1  danh mục
categoryApi.post("/", categoryController.createCategory);

// api: Cập nhập 1  danh mục
categoryApi.put("/update", categoryController.updateCategory);

// api: Xóa 1  danh mục
categoryApi.delete("/delete", categoryController.deleteCategory);

module.exports = categoryApi;
