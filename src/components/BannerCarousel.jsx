import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";

const images = [
  "https://th.bing.com/th/id/R.961969abe011995b0d41e941d8383d0e?rik=bqK2PAAL%2b0GK4w&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.f141f8025a9f7cf23cad6304d02d0c9e?rik=6ZqWnQZiawaqVQ&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/R.9bc0f26aa9c88bb7d951ac9e1c4da4c2?rik=NND%2brJQkz%2b1GIA&pid=ImgRaw&r=0",
];

const CarouselContainer = styled.div`
  width: 80%;
  margin: 68px auto auto;
  overflow: hidden;
  border-radius: 10px; 
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const BannerCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
  };

  return (
    <CarouselContainer>
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <StyledImage src={src} alt={`Imagen ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </CarouselContainer>
  );
};

export default BannerCarousel;