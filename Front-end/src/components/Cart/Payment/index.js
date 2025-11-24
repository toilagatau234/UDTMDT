import { Button } from 'antd';
import constants from 'constants/index';
import helpers from 'helpers';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

function CartPayment(props) {
  // SỬA: Thêm prop discountAmount (mặc định là 0 nếu không có)
  const { carts, isCheckout, transportFee, onCheckout, isLoading, discountAmount = 0 } = props;
  
  // SỬA: Giá tạm tính (Tổng giá gốc niêm yết của tất cả sản phẩm)
  // Công thức đúng: Giá gốc * số lượng
  const tempPrice = carts.reduce(
    (a, b) => a + b.price * b.amount,
    0,
  );

  // Tổng tiền giảm giá từ sản phẩm (Product Discount)
  const totalProductDiscount = carts.reduce(
    (a, b) => a + ((b.price * b.discount) / 100) * b.amount,
    0,
  );

  // Tổng tiền phải thanh toán cuối cùng
  // = Giá gốc - Giảm giá sản phẩm + Phí ship - Giảm giá Voucher
  const totalPayment = tempPrice - totalProductDiscount + transportFee - discountAmount;

  return (
    <div className="Payment bg-white p-16">
      <h2 className="m-b-8">Tiến hành thanh toán</h2>
      
      {/* Giá tạm tính (Giá gốc) */}
      <div className="d-flex justify-content-between m-b-6">
        <span className="font-size-16px" style={{ color: '#aaa' }}>
          Tạm tính
        </span>
        <b>{helpers.formatProductPrice(tempPrice)}</b>
      </div>

      {/* Phí vận chuyển */}
      <div className="d-flex justify-content-between m-b-6">
        <span className="font-size-16px" style={{ color: '#aaa' }}>
          Phí vận chuyển
        </span>
        <b>{helpers.formatProductPrice(transportFee)}</b>
      </div>

      {/* Giảm giá trực tiếp trên sản phẩm */}
      <div className="d-flex justify-content-between m-b-6">
        <span className="font-size-16px" style={{ color: '#aaa' }}>
          Giảm giá sản phẩm
        </span>
        <b>-{helpers.formatProductPrice(totalProductDiscount)}</b>
      </div>

      {/* SỬA: Hiển thị Voucher giảm giá (Nếu có) */}
      {discountAmount > 0 && (
        <div className="d-flex justify-content-between m-b-6">
          <span className="font-size-16px" style={{ color: '#aaa' }}>
            Voucher giảm giá
          </span>
          <b style={{ color: 'green' }}>-{helpers.formatProductPrice(discountAmount)}</b>
        </div>
      )}

      {/* Thành tiền cuối cùng */}
      <div className="d-flex justify-content-between">
        <span className="font-size-16px" style={{ color: '#aaa' }}>
          Thành tiền
        </span>
        <b style={{ color: 'red', fontSize: 20 }}>
          {helpers.formatProductPrice(totalPayment > 0 ? totalPayment : 0)}
        </b>
      </div>
      
      <div className="t-end">
        <span
          style={{ color: '#aaa', fontSize: 16 }}>{`(Đã bao gồm VAT)`}</span>
      </div>

      {isCheckout ? (
        <Button
          onClick={onCheckout}
          className="m-t-16 d-block m-lr-auto w-100"
          type="primary"
          size="large"
          loading={isLoading}
          style={{ backgroundColor: '#3555c5', color: '#fff' }}>
          ĐẶT HÀNG NGAY
        </Button>
      ) : (
        <Link to={constants.ROUTES.PAYMENT}>
          <Button
            className="m-t-16 d-block m-lr-auto w-100"
            type="primary"
            size="large"
            style={{ backgroundColor: '#3555c5', color: '#fff' }}>
            THANH TOÁN
          </Button>
        </Link>
      )}
    </div>
  );
}

CartPayment.defaultProps = {
  carts: [],
  isCheckout: false,
  transportFee: 0,
  isLoading: false,
  discountAmount: 0, // Giá trị mặc định
};

CartPayment.propTypes = {
  carts: PropTypes.array,
  isCheckout: PropTypes.bool,
  transportFee: PropTypes.number,
  onCheckout: PropTypes.func,
  isLoading: PropTypes.bool,
  discountAmount: PropTypes.number, // Định nghĩa kiểu dữ liệu
};

export default CartPayment;