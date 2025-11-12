import styled from 'styled-components';

export const WrapperSidebar = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px 0 0 8px;
`;

export const WrapperHello = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 15px;
  font-size: 18px; 
  font-weight: 600;
  color: #333;
`;

export const WrapperAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const WrapperUserName = styled.span`
  font-weight: 600;
`;

export const WrapperMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WrapperMenuItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 16px; 
  font-weight: 500;
  color: #555;
  
  &:hover {
    background-color: #f5f5f5;
  }

  /* Style cho mục đang được chọn */
  &.active {
    background-color: #f0f5f1; /* Màu nền xanh nhạt */
    color: #326e51; /* Màu xanh lá chủ đạo */
    font-weight: 600;
  }
`;