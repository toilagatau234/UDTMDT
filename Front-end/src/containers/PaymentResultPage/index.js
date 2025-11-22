import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Result, Button, Spin } from 'antd';
import constants from 'constants/index';

function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

  useEffect(() => {
    // Kéo về đầu trang
    document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Lấy mã phản hồi từ URL
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');

    if (responseCode === '00' && transactionStatus === '00') {
      setStatus('success');
      setMessage('Giao dịch thành công!');
    } else {
      setStatus('error');
      let vnpMessage = 'Giao dịch không thành công.';
      // Bạn có thể thêm nhiều mã lỗi VNPay ở đây
      if (responseCode === '24') {
        vnpMessage = 'Giao dịch bị hủy bởi người dùng.';
      }
      setMessage(vnpMessage);
    }
  }, [searchParams]);

  return (
    <div className="container m-tb-32" style={{ minHeight: '60vh' }}>
      {status === 'processing' && (
        <Spin tip={message} size="large">
          <div style={{ padding: 50, borderRadius: 8 }} />
        </Spin>
      )}

      {status === 'success' && (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={message}
          extra={[
            <Button type="primary" key="home">
              <Link to={constants.ROUTES.HOME}>Tiếp tục mua sắm</Link>
            </Button>,
            <Button key="order_details">
              <Link to={constants.ROUTES.ACCOUNT + '/orders'}>Xem lịch sử đơn hàng</Link>
            </Button>,
          ]}
        />
      )}

      {status === 'error' && (
        <Result
          status="error"
          title="Thanh toán không thành công"
          subTitle={message}
          extra={[
            <Button type="primary" key="home">
              <Link to={constants.ROUTES.HOME}>Quay về trang chủ</Link>
            </Button>,
            <Button key="try_again">
              <Link to={constants.ROUTES.PAYMENT}>Thử lại thanh toán</Link>
            </Button>,
          ]}
        />
      )}
    </div>
  );
}

export default PaymentResultPage;