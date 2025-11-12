import React from 'react';
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './style';
import { Checkbox, Rate } from 'antd';
import { useSearchParams } from 'react-router-dom';

const NavBarComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc các giá trị filter hiện tại từ URL
  const activeCategory = searchParams.get('category');
  const activeBrands = searchParams.getAll('brand'); 
  const activeRating = searchParams.get('rating');
  const activePriceLabel = searchParams.get('price_label'); 

  /**
   * Xử lý thay đổi filter Thương hiệu (Checkbox Group)
   * Cho phép chọn nhiều giá trị (multi-select)
   */
  const handleBrandChange = (checkedValues) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('brand'); 
    
    if (checkedValues.length > 0) {
      checkedValues.forEach(value => {
        // Thêm từng giá trị vào URL, e.g., ?brand=Innisfree&brand=CeraVe
        newParams.append('brand', value); 
      });
    }
    setSearchParams(newParams);
  };

  /**
   * Xử lý filter đơn (Danh mục, Đánh giá)
   * Logic: Nếu giá trị đang hoạt động, xóa; ngược lại, đặt giá trị mới.
   */
  const handleFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    // Chuyển value sang String để so sánh với giá trị trong URL
    if (newParams.get(key) === String(value)) { 
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  /**
   * Xử lý filter Khoảng giá (cần 3 tham số trong URL: from, to, label)
   */
  const handlePriceFilter = (from, to, label) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (activePriceLabel === label) {
      // Nếu filter đang hoạt động, xóa cả 3 key
      newParams.delete('price_from');
      newParams.delete('price_to');
      newParams.delete('price_label');
    } else {
      // Ngược lại, đặt 3 key mới
      newParams.set('price_from', from);
      newParams.set('price_to', to);
      newParams.set('price_label', label); 
    }
    setSearchParams(newParams);
  }

  // Hàm render nội dung cho các loại filter khác nhau
  const renderContent = (type, options) => {
    switch (type) {
      case 'text': // Danh Mục
        return options.map((option) => {
          const isActive = activeCategory === option;
          return (
            <WrapperTextValue 
              key={option}
              style={{ 
                color: isActive ? '#326e51' : '#333', 
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer'
              }}
              onClick={() => handleFilter('category', option)}
            >
              {option}
            </WrapperTextValue>
          )
        })
      case 'checkbox': // Thương Hiệu
        return (
          <Checkbox.Group 
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} 
            onChange={handleBrandChange} 
            value={activeBrands} 
          >
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )
      case 'star': // Đánh Giá
        return options.map((option) => {
          const isActive = activeRating === String(option);
          return (
            <div 
              key={option} 
              style={{ 
                display: 'flex', 
                gap: '4px', 
                alignItems: 'center', 
                cursor: 'pointer' // Đã xóa ký tự rác tại đây
              }}
              onClick={() => handleFilter('rating', String(option))}
            >
              <Rate disabled defaultValue={option} style={{ fontSize: '14px' }} />
              <span 
                style={{ 
                  fontSize: '12px', 
                  color: isActive ? '#326e51' : '#787878' 
                }}
              >
                từ {option} sao
              </span>
            </div>
          )
        })
      case 'price': // Khoảng Giá
        return options.map((option) => {
          const isActive = activePriceLabel === option.label;
          return (
            <WrapperTextPrice 
              key={option.label}
              style={{ 
                color: isActive ? '#326e51' : '#333', 
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer' 
              }}
              onClick={() => handlePriceFilter(option.from, option.to, option.label)}
            >
              {option.label}
            </WrapperTextPrice>
          )
        })
      default:
        return null
    }
  }
  
  return (
    <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px' }}>
      
      {/* Danh mục */}
      <WrapperLableText>Danh mục</WrapperLableText>
      <WrapperContent>
        {renderContent('text', [
          'Kem Chống Nắng',
          'Chăm sóc da mặt',
          'Dụng cụ & Phụ kiện',
          'Dưỡng da chuyên sâu',
          'Khuyến mãi & Combo'
        ])}
      </WrapperContent>
      
      {/* Thương hiệu */}
      <WrapperLableText>Thương hiệu</WrapperLableText>
      <WrapperContent>
        {renderContent('checkbox', [
          { value: 'Innisfree', label: 'Innisfree' },
          { value: 'La Roche-Posay', label: 'La Roche-Posay' },
          { value: 'Eigshow', label: 'Eigshow' },
          { value: 'Amortals', label: 'Amortals' },
          { value: 'Real Techniques', label: 'Real Techniques' },
          { value: 'SHUSHU COSMETICS', label: 'SHUSHU COSMETICS' },
          { value: 'CeraVe', label: 'CeraVe' },
          { value: '3CE', label: '3CE' }
        ])}
      </WrapperContent>
      
      {/* Đánh giá */}
      <WrapperLableText>Đánh giá</WrapperLableText>
      <WrapperContent>
        {renderContent('star', [5, 4, 3])}
      </WrapperContent>
      
      {/* Khoảng giá */}
      <WrapperLableText>Khoảng giá</WrapperLableText>
      <WrapperContent>
        {renderContent('price', [
          { label: 'Dưới 100.000đ', from: 0, to: 100000 },
          { label: '100.000đ - 300.000đ', from: 100000, to: 300000 },
          { label: '300.000đ - 500.000đ', from: 300000, to: 500000 },
          { label: '500.000đ - 1.000.000đ', from: 500000, to: 1000000 },
          { label: 'Trên 1.000.000đ', from: 1000000, to: 99999999 }
        ])}
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;