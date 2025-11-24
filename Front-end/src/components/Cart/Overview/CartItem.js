import { DeleteOutlined } from '@ant-design/icons';
// SỬA: Thêm Popconfirm vào import
import { Avatar, InputNumber, Tooltip, Popconfirm } from 'antd'; 
import helpers from 'helpers';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// SỬA: Dùng default parameters thay cho defaultProps
function CartItem({
  _id = '',
  name = '',
  code = '',
  avt = '',
  stock = 0,
  discount = 0,
  price = 0,
  amount = 1,
  index,
  onDelCartItem,
  onUpdateNumOfProd,
}) {
  
  return (
    <div className="d-flex bg-white p-12 bor-rad-4 justify-content-between">
      {/* sản phẩm */}
      <div className="d-flex flex-grow-1">
        <Avatar src={avt} alt="Photo" shape="square" size={80} />
        <div
          className="d-flex flex-direction-column p-lr-8"
          style={{ maxWidth: 400 }}
        >
          <Link to={`/product/${_id}`} className="font-size-16px">
            <Tooltip title={name}>
              {helpers.reduceProductName(name, 20)}
            </Tooltip>
          </Link>
          <span style={{ color: '#aaa' }}>{code}</span>
        </div>
      </div>

      {/* Thêm giảm sản phẩm */}
      <div className="d-flex align-i-center" style={{ flexBasis: 128 }}>
        {/* Popconfirm bây giờ đã được định nghĩa */}
        <Popconfirm
          title="Bạn có chắc muốn xoá toàn bộ sản phẩm trong giỏ hàng ?"
          placement="bottom"
          okButtonProps={{ type: "primary" }}
          onConfirm={() => onDelCartItem(index)}
          okText="Đồng ý"
          cancelText="Huỷ bỏ"
        >
          <DeleteOutlined className="icon-del-item m-r-16" />
        </Popconfirm>

        <div>
          <InputNumber
            min={1}
            max={stock}
            value={amount}
            onChange={(value) => onUpdateNumOfProd(index, value)}
            size="large"
            style={{ borderColor: '#3555C5' }}
          />
        </div>
      </div>

      {/* Giá */}
      {discount > 0 ? (
        <div
          className="d-flex flex-direction-column align-items-end"
          style={{ flexBasis: 180 }}
        >
          <b className="font-size-18px" style={{ color: "#3555C5" }}>
            {helpers.formatProductPrice(price - (price * discount) / 100)}
          </b>
          <span style={{ textDecoration: "line-through", color: "#aaa" }}>
            {helpers.formatProductPrice(price)}
          </span>
        </div>
      ) : (
        <div
          className="d-flex flex-direction-column align-items-end"
          style={{ flexBasis: 180 }}
        >
          <b className="font-size-18px" style={{ color: "#3555C5" }}>
            {helpers.formatProductPrice(price)}
          </b>
        </div>
      )}
    </div>
  );
}

// XÓA: CartItem.defaultProps

CartItem.propTypes = {
  onDelCartItem: PropTypes.func,
  onUpdateNumOfProd: PropTypes.func,
  index: PropTypes.any,
  _id: PropTypes.string,
  avt: PropTypes.string,
  code: PropTypes.string,
  discount: PropTypes.number,
  amount: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  stock: PropTypes.number,
};

export default CartItem;