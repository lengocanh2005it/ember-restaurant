import ButtonSlides from "@/components/buttons/ButtonSlides";
import { Chip } from "@heroui/react";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import SwiperCore from "swiper/core";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const reviews = [
  {
    name: "John Dark",
    rate: 5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "FullStack Developer",
    image: "/employees/user-1.webp",
    date: "2022-12-12",
  },
  {
    name: "Putin V",
    rate: 4,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "FrontEnd Developer",
    image: "/employees/customer-1.jpg",
    date: "2020-12-10",
  },
  {
    name: "Coleman Vinci",
    rate: 5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "President of UK",
    image: "/employees/customer-3.jpg",
    date: "2018-09-09",
  },
  {
    name: "Maria Ona",
    rate: 4,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "Sales Manager",
    image: "/employees/customer-2.jpg",
    date: "2022-12-12",
  },
  {
    name: "Alice San",
    rate: 5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "Software Developer",
    image: "/employees/customer-4.jpg",
    date: "2022-12-12",
  },
  {
    name: "Alexander IV",
    rate: 4,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "FullStack Developer",
    image: "/employees/user-8.avif",
    date: "2022-12-12",
  },
  {
    name: "Steve Leven",
    rate: 5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "FullStack Developer",
    image: "/employees/user-9.avif",
    date: "2022-12-12",
  },
  {
    name: "Ronal Dav",
    rate: 5,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur rem laudantium reprehenderit.",
    career: "FullStack Developer",
    image: "/employees/user-11.avif",
    date: "2022-12-12",
  },
];

const ReviewDetails: React.FC = () => {
  SwiperCore.use([Autoplay]);

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={4}
      wrapperClass="flex"
      className="relative flex overflow-hidden justify-between items-center w-full h-full"
      loop={true}
      autoplay={{ delay: 6200, disableOnInteraction: true }}
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        960: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      }}
    >
      {reviews.map((review, index) => {
        return (
          <div key={index} className="w-full relative">
            <SwiperSlide
              className="relative bg-primary border border-white/20 p-4 rounded-[15px]
             flex flex-col hover:border-white/60 ease-in-out transition-all
               select-none duration-300 cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <div className="h-[40vh] relative w-full">
                  {review.image && (
                    <Image
                      src={review.image}
                      alt=""
                      layout="fill"
                      priority
                      sizes="(max-width: 600px) 100vw, 50vw"
                      className="rounded-[15px] object-cover border-2 border-white/30
                     bg-blend-lighten opacity-80 hover:opacity-100
                      ease-in-out transition-all duration-300"
                    />
                  )}
                </div>

                <div className="flex flex-col select-none gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col text-[14px] text-left">
                      <h1 className="text-xl font-bold text-white">
                        {review.name}
                      </h1>
                      <p className="text-white/50">{review.career}</p>
                    </div>

                    <p className="text-[14px] text-white/50">
                      {review.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-[16px]">Star Rate: </p>
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: review.rate }).map((_, index) => {
                        return (
                          <span
                            key={index}
                            className="text-[#ffff00] text-2xl opacity-90"
                          >
                            <StarIcon />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium text-white/60">
                      {review.date}
                    </p>

                    <Chip color="primary" className="bg-white text-black">
                      See Details
                    </Chip>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </div>
        );
      })}

      <div className="absolute w-full">
        <ButtonSlides
          containerStyles="w-full flex items-center justify-between"
          iconStyles="text-4xl font-bold hover:text-accent transition-all 
          opacity-40 hover:opacity-100"
          buttonStyles="rounded-full"
        />
      </div>
    </Swiper>
  );
};

export default ReviewDetails;
