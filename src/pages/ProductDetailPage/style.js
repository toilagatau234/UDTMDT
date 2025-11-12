import { Row, Col, Button, InputNumber } from 'antd'; // 'Image' đã được xóa
import styled from 'styled-components';

export const WrapperContainer = styled.div`
  background-color: #efefef;
  padding: 20px 0;
`;

export const WrapperLayout = styled.div`
  width: 1270px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

// === CỘT BÊN TRÁI (Ảnh) ===
export const WrapperStyleColImage = styled(Col)`
  flex-basis: 40%;
`;

// SỬA LỖI 'img is not defined' TẠI ĐÂY:
export const WrapperStyleImageSmall = styled('img')`
  width: 78px;
  height: 78px;
  object-fit: contain;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  
  &.active {
    border-color: #326e51; /* Màu xanh lá chủ đạo */
  }
  
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const WrapperThumbnailGroup = styled(Row)`
  margin-top: 10px;
  justify-content: flex-start;
  gap: 10px;
`;

// === CỘT BÊN PHẢI (Thông tin) ===
export const WrapperStyleColInfo = styled(Col)`
  flex-basis: 60%;
  padding-left: 30px;
`;

export const WrapperStyleNameProduct = styled.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
`;

export const WrapperStyleTextSell = styled.div`
  font-size: 15px;
  color: #555;
  margin-top: 8px;
`;

export const WrapperPriceProduct = styled.div`
  background-color: #fafafa;
  padding: 15px 20px;
  border-radius: 6px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const WrapperPriceTextProduct = styled.span`
  font-size: 32px;
  font-weight: 600;
  color: #326e51; /* Màu xanh lá chủ đạo */
`;

export const WrapperOriginalPrice = styled.span`
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
`;

export const WrapperDiscount = styled.span`
  font-size: 14px;
  font-weight: 600;
  padding: 3px 8px;
  background-color: #fceced; /* Màu hồng nhạt */
  color: #d0011b; /* Màu đỏ */
  border-radius: 4px;
`;

export const WrapperInfoRow = styled(Row)`
  margin-top: 15px;
  align-items: center;
`;

export const WrapperInfoLabel = styled(Col)`
  font-size: 15px;
  color: #757575;
  width: 130px;
  flex-shrink: 0;
`;

export const WrapperInfoContent = styled(Col)`
  font-size: 15px;
  color: #333;
`;

export const WrapperVariationGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const WrapperVariationButton = styled(Button)`
  background-color: #fff;
  color: #333;
  border: 1px solid #d9d9d9;
  height: auto;
  min-height: 32px;
  padding: 5px 15px;
  font-size: 14px;

  &.active {
    border-color: #326e51;
    color: #326e51;
    background-color: #f0f5f1;
    font-weight: 500;
  }
  
  &.ant-btn-disabled {
    background-color: #f5f5f5;
    color: #d9d9d9;
    border-color: #d9d9d9;
  }
`;

export const WrapperShipping = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const WrapperGuarantee = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
`;

export const WrapperQualityProduct = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
`;

export const WrapperQualityLabel = styled.span`
  font-size: 15px;
  color: #757575;
  width: 130px;
  text-align: right;
  padding-right: 20px;
`;

export const WrapperInputNumber = styled(InputNumber)`
  width: 60px;
  .ant-input-number-input {
    text-align: center;
  }
`;

export const WrapperBtnQualityProduct = styled(Button)`
  border: 1px solid #e0e0e0;
  width: 32px;
  height: 32px;
`;

export const WrapperStockText = styled.span`
  font-size: 14px;
  color: #757575;
  margin-left: 10px;
`;

export const WrapperButtonRow = styled(Row)`
  margin-top: 25px;
  margin-left: 130px; /* Căn lề với label */
  gap: 15px;
`;

export const AddToCartButton = styled(Button)`
  background-color: #f0f5f1; /* Màu xanh lá nhạt */
  color: #326e51;
  border: 1px solid #326e51;
  height: 48px;
  font-size: 16px;
  padding: 0 25px;
  font-weight: 500;
  
  &:hover {
    background-color: #e6f0e9;
    color: #326e51 !important;
    border-color: #326e51 !important;
  }
`;

export const BuyNowButton = styled(Button)`
  background-color: #326e51; /* Màu xanh lá chủ đạo */
  color: #fff;
  border: none;
  height: 48px;
  font-size: 16px;
  padding: 0 30px;
  font-weight: 500;

  &:hover {
    background-color: #2b5a41; /* Màu xanh đậm */
    color: #fff !important;
  }
`;

export const WrapperDescription = styled.div`
  margin-top: 30px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 15px;
    background-color: #fafafa;
    padding: 12px 20px;
  }
  
  div {
    padding: 0 20px;
  }
`;