"use client";
import React from "react";

// swiper
import { useSwiper } from "swiper/react";

// icons
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

const ButtonSlides = ({
  containerStyles,
  buttonStyles,
  iconStyles,
}: {
  containerStyles: string;
  buttonStyles: string;
  iconStyles: string;
}) => {
  const swiper = useSwiper();
  return (
    <div className={containerStyles}>
      <button className={buttonStyles} onClick={() => swiper.slidePrev()}>
        <PiCaretLeftBold className={iconStyles} />
      </button>

      <button className={buttonStyles} onClick={() => swiper.slideNext()}>
        <PiCaretRightBold className={iconStyles} />
      </button>
    </div>
  );
};

export default ButtonSlides;
