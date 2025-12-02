import React, { useState } from 'react';
import { Modal, Rate, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as ReviewService from '../../services/ReviewService'; // File service bạn đã tạo
import { getImageUrl } from '../../services/ProductService';

const ReviewModal = ({ isOpen, onCancel, onSuccess, productInfo, orderId, token }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        if (!comment) {
            message.warning('Vui lòng viết nội dung đánh giá!');
            return;
        }

        setLoading(true);
        try {
            // 1. Upload ảnh (Nếu có - Logic này tuỳ thuộc vào cách backend bạn xử lý upload)
            // Giả sử backend nhận base64 hoặc link ảnh. Ở đây mình demo gửi text trước.
            // Nếu muốn gửi ảnh, bạn cần formData giống như lúc tạo sản phẩm.
            
            const data = {
                productId: productInfo?.id,
                orderId: orderId,
                rating: rating,
                comment: comment,
                // images: [] // Xử lý ảnh sau nếu cần
            };

            const res = await ReviewService.createReview(data, token);
            
            if (res.status === 'OK') {
                message.success('Đánh giá thành công!');
                onSuccess(); // Callback để reload lại list đơn hàng (ẩn nút đánh giá đi)
                handleCancel();
            } else {
                message.error(res.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            message.error('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setRating(5);
        setComment('');
        setFileList([]);
        onCancel();
    };

    return (
        <Modal
            title="Đánh giá sản phẩm"
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <img 
                    src={getImageUrl(productInfo?.image)} 
                    alt="product" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
                />
                <div>
                    <div style={{ fontWeight: 'bold' }}>{productInfo?.name}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>Phân loại: {productInfo?.variantName || 'Mặc định'}</div>
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <div style={{ marginBottom: '5px' }}>Chất lượng sản phẩm:</div>
                <Rate value={rating} onChange={setRating} style={{ fontSize: '24px', color: '#ffce3d' }} />
                <span style={{ marginLeft: '10px', color: '#ffce3d' }}>
                    {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Hài lòng' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Không hài lòng' : 'Tệ'}
                </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <Input.TextArea 
                    rows={4} 
                    placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..." 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            {/* Phần Upload ảnh (Optional) */}
            {/* <div style={{ marginBottom: '20px' }}>
                <Upload listType="picture-card" fileList={fileList} onChange={({ fileList }) => setFileList(fileList)} beforeUpload={() => false}>
                    {fileList.length < 5 && <div><UploadOutlined /><div style={{ marginTop: 8 }}>Thêm ảnh</div></div>}
                </Upload>
            </div> */}

            <div style={{ textAlign: 'right' }}>
                <Button onClick={handleCancel} style={{ marginRight: '10px' }}>Trở lại</Button>
                <Button type="primary" onClick={handleOk} loading={loading} style={{ background: '#326e51' }}>
                    Hoàn thành
                </Button>
            </div>
        </Modal>
    );
};

export default ReviewModal;