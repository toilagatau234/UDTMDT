import commentApi from 'apis/commentApi';
import EvaluationView from 'components/ProductDetail/Evaluation';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

function Evaluation(props) {
  const { productId, rates } = props;

  const [cmtList, setCmtList] = useState([]);

  useEffect(() => {
    let isSubscribe = true;
    const getCommentList = async () => {
      try {
        const response = await commentApi.getCommentList(productId);
        if (response && isSubscribe) {
          setCmtList(response.data);
        }
      } catch (error) {}
    };
    getCommentList();
    return () => (isSubscribe = false);
  }, [props]);

  // event: xoá nhận xét
  const onDelete = async (_id) => {
    try {
      const response = await commentApi.deleteComment(_id);
      if (response && response.status === 200) {
        message.success("Xoá thành công.");
        const newList = cmtList.filter((item) => item._id !== _id);
        setCmtList(newList);
      }
    } catch (error) {
      message.error("Xoá thất bại, thử lại !");
    }
  };

  // event: Cập nhập sản phẩm
  const onEdit = async (id, value) => {
    try {
      const response = await commentApi.updateComment(id, value);
      if (response && response.status === 200) {
        const newList = cmtList.map((item) =>
        item._id !== id ? item : { ...item, content: value }
        );
        setCmtList(newList);
        message.success("Cập nhật thành công");
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <div>
      <EvaluationView productId={productId} rates={rates} cmtList={cmtList} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}

Evaluation.propTypes = {
  productId: PropTypes.string,
  rates: PropTypes.array || PropTypes.object,
};

export default Evaluation;
