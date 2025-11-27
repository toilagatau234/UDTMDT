import { Col, Row, Image, InputNumber, Button } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
    background-color: #efefef;
    padding: 20px 0;
    min-height: 80vh;
`;

export const WrapperLayout = styled.div`
    width: 1270px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
`;

// CỘT BÊN TRÁI
export const WrapperStyleColImage = styled(Col)`
    background-color: #fff;
    border-radius: 8px;
`;

export const WrapperThumbnailGroup = styled.div`
    margin-top: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

export const WrapperStyleImageSmall = styled.img`
    width: 80px;
    height: 80px;
    object-fit: contain;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.2s;

    &.active {
        border-color: #326e51;
        border-width: 2px;
    }
    
    ${(props) => props.disabled && `
        cursor: not-allowed;
        opacity: 0.6;
    `}
`;

// CỘT BÊN PHẢI
export const WrapperStyleColInfo = styled(Col)`
    padding-left: 30px !important;
`;

export const WrapperStyleNameProduct = styled.h1`
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    color: #333;
    margin-bottom: 5px;
`;

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    color: #777;
    margin-bottom: 15px;
    display: block;
`;

export const WrapperPriceProduct = styled.div`
    background-color: #fafafa;
    border-radius: 8px;
    padding: 15px 20px;
    display: flex;
    align-items: baseline;
    gap: 15px;
`;

export const WrapperPriceTextProduct = styled.h2`
    font-size: 30px;
    font-weight: 700;
    color: #326e51;
    margin: 0;
`;

export const WrapperOriginalPrice = styled.span`
    font-size: 16px;
    color: #888;
    text-decoration: line-through;
`;

export const WrapperDiscount = styled.span`
    background-color: #fff0f1;
    color: #d0011b;
    border: 1px solid #ffb8c1;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
`;

export const WrapperInfoRow = styled(Row)`
    margin-top: 20px;
    align-items: center;
`;

export const WrapperInfoLabel = styled.div`
    font-size: 15px;
    color: #777;
    width: 130px;
    flex-shrink: 0;
`;

export const WrapperInfoContent = styled.div`
    flex: 1;
`;

export const WrapperShipping = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 500;
`;

export const WrapperGuarantee = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #555;
    font-weight: 500;
    border: 1px dashed #ccc;
    padding: 5px 10px;
    border-radius: 4px;
`;

export const WrapperVariationGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const WrapperVariationButton = styled(Button)`
    border: 1px solid #ccc;
    padding: 5px 15px;
    height: auto;
    font-weight: 500;

    &.active {
        border-color: #326e51;
        color: #326e51;
        background-color: #f0f5f1;
    }
    
    &:disabled {
        background-color: #f5f5f5;
        border-color: #e0e0e0;
        color: #aaa;
        cursor: not-allowed;
        
        /* Gạch chéo */
        background-image: linear-gradient(
            to top left,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 47%,
            #aaa 47%,
            #aaa 53%,
            rgba(255, 255, 255, 0) 53%,
            rgba(255, 255, 255, 0) 100%
        );
    }
`;

export const WrapperQualityLabel = styled.div`
    font-size: 15px;
    color: #777;
    width: 130px;
    padding-top: 5px;
    flex-shrink: 0;
`;

export const WrapperQualityProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

export const WrapperBtnQualityProduct = styled(Button)`
    width: 32px;
    height: 32px;
    border: 1px solid #ccc;
    padding: 0;
`;

export const WrapperInputNumber = styled(InputNumber)`
    width: 50px;
    .ant-input-number-input {
        text-align: center;
    }
`;

export const WrapperStockText = styled.span`
    font-size: 14px;
    color: #777;
    margin-left: 10px;
`;

export const WrapperButtonRow = styled(Row)`
    margin-top: 30px;
    display: flex;
    gap: 15px;
`;

export const AddToCartButton = styled(Button)`
    background-color: #f0f5f1;
    border: 1px solid #326e51;
    color: #326e51;
    font-weight: 500;
    min-width: 200px;
    height: 48px;
    font-size: 16px;

    &:hover {
        background-color: #e6f7f0;
        border-color: #326e51;
        color: #326e51;
    }
`;

export const BuyNowButton = styled(Button)`
    background-color: #326e51;
    border-color: #326e51;
    color: #fff;
    font-weight: 500;
    min-width: 200px;
    height: 48px;
    font-size: 16px;

    &:hover, &:focus {
        background-color: #2b5a41;
        border-color: #2b5a41;
        color: #fff;
    }
`;

export const FavoriteButton = styled(Button)`
    background-color: #fff;
    border: 1px solid #ff6b81;
    color: #ff6b81;
    font-weight: 500;
    min-width: 200px;
    height: 48px;
    font-size: 16px;

    &:hover {
        background-color: #fff0f2;
        border-color: #ff6b81;
        color: #ff3b61;
    }
`

// PHẦN MÔ TẢ BÊN DƯỚI
export const WrapperDescription = styled.div`
    h2 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
    }
    
    div {
        color: #555;
        line-height: 1.8;
        font-size: 16px; /* tăng cỡ chữ mô tả sản phẩm */

        p {
            margin-bottom: 15px;
        }
        ul {
            padding-left: 25px;
            margin-bottom: 15px;
        }
    }
`;