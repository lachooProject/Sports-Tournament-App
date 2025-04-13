import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ResponsiveSlider({ slides, renderSlide }) {
  const settings = {
    slidesToShow: 4,
    initialSlide: 0,
    speed: 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-[100%] mx-auto py-10">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="px-5">
            {renderSlide(slide)}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ResponsiveSlider;
