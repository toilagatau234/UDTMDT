import { Upload, Button } from 'antd';
import styled from 'styled-components';

export const WrapperContainer = styled.div`
  background-color: #efefef;
  padding: 20px 0;
  min-height: 80vh;
`;

export const WrapperContent = styled.div`
  width: 1270px;
  margin: 0 auto;
  display: flex;
  background-color: #fff;
  border-radius: 8px;
`;

export const WrapperSidebar = styled.div`
  flex: 0 0 220px;
  border-right: 1px solid #f0f0f0;
`;

export const WrapperMainContent = styled.div`
  flex: 1;
  padding: 20px 30px;
`;

// === CÁC STYLE MỚI CHO TRANG HỒ SƠ ===

export const ProfileHeader = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

export const ProfileBody = styled.div`
  display: flex;
  margin-top: 20px;
`;

export const FormLeft = styled.div`
  flex: 1;
  padding-right: 50px;
`;

export const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .ant-form-item {
    margin-bottom: 0;
    flex: 1;
  }
`;

export const FormLabel = styled.span`
  width: 130px;
  text-align: right;
  padding-right: 20px;
  color: #555;
  font-size: 15px;
`;

export const FormControl = styled.div`
  flex: 1;
  
  .ant-input-disabled {
    color: #333;
    background-color: #fafafa;
  }
`;

export const SaveButton = styled(Button)`
  background-color: #326e51;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  height: 40px;
  padding: 0 30px;
  border: none;
  margin-left: 150px; 

  &:hover {
    background-color: #2b5a41;
    color: #326e51 !important;
  }
`;

export const AvatarRight = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid #f0f0f0;
  padding-left: 50px;
`;

export const AvatarWrapper = styled(Upload)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
  }
  .ant-upload-list-picture-card-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
`;

export const AvatarText = styled.div`
  font-size: 13px;
  color: #999;
  text-align: center;
  margin-top: 10px;
  line-height: 1.5;
`;