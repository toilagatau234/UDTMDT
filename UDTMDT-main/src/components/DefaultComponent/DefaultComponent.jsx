import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
// 👇 1. Import FooterComponent
import FooterComponent from '../FooterComponent/FooterComponent'

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      
      {/* Phần nội dung thay đổi của từng trang */}
      {children}
      
      {/* 👇 2. Đặt Footer ở dưới cùng */}
      <FooterComponent />
    </div>
  )
}

export default DefaultComponent