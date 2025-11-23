const CommentModel = require('../models/comment.model');
const ProductModel = require('../models/product.models/product.model');

// api: Lấy danh sách comment của 1 sản phẩm
const getCommentList = async (req, res, next) => {
  try {
    const { id } = req.query;
    const data = await CommentModel.find({ productId: id }).select(
      '-productId',
    );
    if (data) return res.status(200).json(data);
  } catch (error) {
    return res.status(409).json({ message: error });
  }
};

// api: Thêm 1 comment
const postComment = async (req, res, next) => {
  try {
    const data = req.body;
    const { productId, rate } = data;
    // Nếu có rate thì cập nhật lại rate trong product
    if (parseInt(rate) !== -1) {
      const product = await ProductModel.findById(productId);
      if (product) {
        let oldRate = product.rate;
        oldRate[rate]++;
        await ProductModel.updateOne(
          { _id: productId },
          { rate: [...oldRate] },
        );
      }
    }

    const response = await CommentModel.create(data);
    if (response) return res.status(200).send('success');
    return res.status(400).send('failed');
  } catch (error) {
    return res.status(400).send('failed');
  }
};

//api: chỉnh sửa 1 comment
const updateComment = async (req, res, next) => {
  try {
    const comment = req.body
    const {_id, ...rest} = comment
    const response = await CommentModel.findById({_id : _id})
    if(response) {
      const result = await CommentModel.updateOne(
        { _id: comment._id },
        { ...rest }
      )
      if (result) {
        return res.status(200).json({ message: "success" });
      }
    }
  } catch (error) {
    return res.status(400).send('failed');
  }
}

//api: Xóa 1 comment
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.query
    const response = await CommentModel.findById(id);
    if (response) {
      await CommentModel.deleteOne({_id: id})
      return res.status(200).json({ message: "success" });
    }
  } catch (error) {
    return res.status(400).send('failed');
  }
}

module.exports = {
  getCommentList,
  postComment,
  updateComment,
  deleteComment
};
