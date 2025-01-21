"use client";
import ButtonSlides from "@/components/buttons/ButtonSlides";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import SwiperCore from "swiper/core";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const employees = [
  { name: "Luke Coleman", image: "/employees/user-7.webp", role: "Manager" },
  { name: "Emma Charlotte", image: "/employees/user-2.webp", role: "Chef" },
  { name: "Amelia Rose", image: "/employees/user-3.webp", role: "Chef" },
  { name: "Aurora Bella", image: "/employees/user-4.jpeg", role: "Staff" },
  { name: "Viet Do", image: "/employees/user-5.webp", role: "Staff" },
  { name: "John Doe", image: "/employees/user-6.webp", role: "Staff" },
];

const AboutPhoto = () => {
  SwiperCore.use([Autoplay]);

  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={15}
      className="flex w-full overflow-hidden h-[500px] relative"
      wrapperClass="flex"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop
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
      {employees.map((employee, index) => (
        <SwiperSlide key={index}>
          <div
            className="w-full h-full cursor-pointer opacity-50 hover:opacity-100 transition-all
           select-none absolute flex flex-col rounded-xl text-white p-4
            gap-5 border border-white/30 items-center"
          >
            <div className="lg:w-[95%] w-full relative h-screen select-none">
              {employee && employee.image && (
                <Image
                  src={employee.image}
                  alt="image"
                  fill
                  sizes="(max-width: 600px) 100vw, 50vw"
                  priority
                  className="rounded-xl object-cover select-none"
                />
              )}
            </div>

            <Separator className="bg-white/30 px-6" />

            <div
              className="flex flex-col items-center justify-center
             text-white relative text-center w-full flex-1"
            >
              <h1 className="lg:text-2xl text-xl font-bold">{employee.name}</h1>

              <p className="lg:text-xl text-[15px] text-white/50">
                {employee.role}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}

      <div className="absolute w-full z-[20] top-[40%]">
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

export default AboutPhoto;
