"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay } from "swiper/modules";

const images = [
  "/assets/image-1.avif",
  "/assets/image-2.avif",
  "/assets/image-3.avif",
  "/assets/image-4.avif",
];

const PhotosWelcome = () => {
  SwiperCore.use([Autoplay]);

  return (
    <div className="relative xl:w-full xl:mx-0 h-full lg:w-[70%] md:w-[80%] w-[90%] mx-auto">
      <Swiper
        className="relative flex overflow-hidden w-full h-full"
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        wrapperClass="flex"
      >
        {images.map((image, index) => {
          return (
            <SwiperSlide
              key={index}
              className="cursor-pointer relative w-full h-full"
            >
              <div className="w-full h-full relative">
                {image && (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 100vw, 50vw"
                    priority
                    className="select-none rounded-[20px] opacity-80 hover:opacity-100 transition-all
                   object-cover"
                  />
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default PhotosWelcome;
