"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper/core";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { EyeIcon } from "lucide-react";
import { Button } from "@nextui-org/react";
import { Separator } from "@/components/ui/separator";

const dishes = [
  {
    title: "Appetizers",
    description:
      "Begin your meal with our delectable appetizers, crafted with fresh ingredients to excite your palate. Each appetizer is designed to complement the main course, offering a perfect start to a fulfilling.",
    image: "/dishes/dishes-2.jpg",
    name: "View Appetizers",
    id: "appetizers",
  },
  {
    title: "Desserts",
    description:
      "Indulge in our exquisite desserts, crafted to perfection to provide a sweet and satisfying end to your meal. Each dessert is a delightful treat, made with premium ingredients and artistic flair.",
    image: "/dishes/dishes-3.jpg",
    name: "View Desserts",
    id: "desserts",
  },
  {
    title: "Hot Pots",
    description:
      "Warm up with our flavorful hotpots, featuring a rich variety of ingredients simmered to perfection. Each hotpot is designed to offer a comforting and hearty experience, perfect for sharing with friends and family.",
    image: "/dishes/dishes-4.jpg",
    name: "View Hotpots",
    id: "hotpots",
  },
  {
    title: "Main Courses",
    description:
      "Enjoy hearty main courses expertly prepared with high-quality ingredients. From succulent meats to delicious vegetarian options, our dishes promise a fulfilling and flavorful dining experience.",
    image: "/dishes/dishes-5.jpg",
    name: "View Main Courses",
    id: "main-courses",
  },
  {
    title: "Beverages",
    description:
      "Quench your thirst with our range of beverages, including cocktails, fresh juices, specialty coffees, and fine wines. Each drink complements your meal and enhances your dining experience.",
    image: "/dishes/dishes-6.jpg",
    name: "View Beverages",
    id: "beverages",
  },
  {
    title: "Specialty Dishes",
    description:
      "Discover our specialty dishes, showcasing culinary expertise and creativity. Enjoy distinctive flavors and innovative ingredients for an exceptional dining experience and satisfaction at Ember.",
    image: "/dishes/dishes-7.jpg",
    name: "View Specialty Dishes",
    id: "specialty-dishes",
  },
];

const ListDishes: React.FC = () => {
  SwiperCore.use([Autoplay]);

  return (
    <div className="w-full relative">
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        wrapperClass="flex"
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
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
          1170: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        className="relative flex overflow-hidden justify-between items-center w-full h-full"
      >
        {dishes.map((dish, index) => {
          return (
            <SwiperSlide key={index} className="w-full h-full relative">
              <div
                className="flex flex-col xl:gap-6 gap-4 p-2 opacity-60 hover:opacity-100 
              ease-in-out hover:border-white/40 duration-200 transition-all cursor-pointer 
              border border-white/20 rounded-[15px]"
              >
                {dish.image && (
                  <div className="h-[30vh] relative w-full">
                    <Image
                      src={dish.image}
                      alt="dish"
                      sizes="(max-width: 600px) 100vw, 50vw"
                      priority
                      fill
                      className="rounded-[15px] object-cover"
                    />
                  </div>
                )}

                <div
                  className="flex flex-col xl:gap-4 gap-2
                 text-center text-[14px] items-center justify-center"
                >
                  <Separator className="mx-4 bg-white/20" />

                  <h1 className="text-white lg:text-2xl text-xl font-bold">
                    {dish.title}
                  </h1>

                  <div className="flex flex-col gap-1">
                    <p className="text-white/60 lg:text-[14px] text-[12px]">
                      {dish.description}
                    </p>

                    <Button
                      className="bg-primary border-white/30 border text-white w-fit mx-auto
                    flex items-center gap-2 hover:bg-white/30"
                      onPress={() =>
                        document
                          .getElementById(`${dish.id}`)
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <EyeIcon />
                      {dish.name}
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ListDishes;
