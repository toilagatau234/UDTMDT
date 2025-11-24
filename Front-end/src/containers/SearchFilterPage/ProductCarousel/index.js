import { Carousel } from 'antd';
import React from 'react';
import './index.scss';

const list = [
  'https://res.cloudinary.com/dmlv4rbtm/image/upload/v1763452410/unnamed_2_d2ccjd_xwiypl.webp',
  'https://res.cloudinary.com/dmlv4rbtm/image/upload/v1763452409/unnamed_flqfng_qafqwa.webp',
  'https://res.cloudinary.com/dmlv4rbtm/image/upload/v1763452409/unnamed_1_t5luv4_t64cl6.webp',
];

function ProductCarousel() {
  const settings = {
    autoplay: true,
    infinite: true,
    dots: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  
  return (
    // SỬA: Đổi Slider thành Carousel
    <Carousel className="ProductCarousel p-t-20 " {...settings}>
      {list.map((item, index) => (
        <img className="ProductCarousel-img" src={item} alt={item} key={index} />
      ))}
    </Carousel>
  );
}

export default ProductCarousel;