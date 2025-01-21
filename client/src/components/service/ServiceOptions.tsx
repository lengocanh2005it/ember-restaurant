"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";

const services = [
  {
    name: "Table Reservation",
    description:
      "Book your table online or by phone to ensure you have a spot ready for you when you arrive.",
    image: "/assets/reservation-1.jpg",
  },
  {
    name: "Food Delivery",
    description:
      "Enjoy our delicious meals in the comfort of your home with our fast and reliable delivery service.",
    image: "/assets/reservation-2.jpg",
  },
  {
    name: "Event Catering",
    description:
      "We cater for special events like birthdays, weddings, and corporate gatherings with personalized service.",
    image: "/assets/reservation-3.jpg",
  },
  {
    name: "Online Ordering",
    description:
      "Easily order your meals online and choose between pickup or delivery options.",
    image: "/assets/reservation-4.jpg",
  },
  {
    name: "Loyalty Program",
    description:
      "Join our loyalty program to receive exclusive offers, promotions, and rewards for every purchase.",
    image: "/assets/reservation-6.jpg",
  },
  {
    name: "Outdoor Catering",
    description:
      "We offer outdoor catering services for BBQs, picnics, and other outdoor events with a variety of menu options.",
    image: "/assets/reservation-7.jpg",
  },
];

import { Button, Pagination } from "@nextui-org/react";
import { motion } from "framer-motion";

const ServiceOptions: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const initialPages = 3;

  const totalPages = useMemo(() => {
    return Math.ceil(services.length / initialPages) ?? 0;
  }, []);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return services.slice(start, end) ?? [];
  }, [page]);

  return (
    <>
      <motion.div
        className="grid xl:grid-cols-3 xl:grid-rows-1 xl:gap-8 xl:p-4 
    lg:grid-cols-2 grid-cols-1 gap-6"
      >
        {items.map((service, index) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.9,
                  duration: 1.2,
                  ease: "easeInOut",
                },
              }}
              key={index}
              className="xl:h-[550px] h-[400px] flex w-full flex-col
               border border-white/30 rounded-[15px]
                xl:gap-6 gap-4 justify-between p-3 relative cursor-pointer"
            >
              <div className="w-full h-[70%] relative">
                {service && service.image && (
                  <Image
                    src={service.image}
                    alt="image"
                    fill
                    priority
                    sizes="(max-width:600px) 100vw, 50vw"
                    className="rounded-[15px] object-cover select-none
                   cursor-pointer opacity-70"
                  />
                )}
              </div>

              <div className="flex flex-col xl:gap-4 gap-1 w-full">
                <div
                  className="text-center w-full flex flex-col 
                  gap-2 ease-in-out duration-300 transition-all"
                >
                  <h1 className="xl:text-2xl text-xl text-accent font-bold">
                    {service.name}
                  </h1>

                  <p className="text-[14px] text-white/60">
                    {service.description}
                  </p>
                </div>

                <Button
                  className="bg-white text-black 
         transition-all w-fit mx-auto text-[15px] px-4
         ease-in-out duration-300 hover:scale-[1.15]"
                >
                  Choose This Service
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex lg:items-start lg:justify-start items-center justify-center">
        <Pagination
          initialPage={page}
          total={totalPages}
          onChange={(page) => setPage(page)}
          showControls
          showShadow
          isCompact
          classNames={{
            cursor: "bg-black text-white",
          }}
        />
      </div>
    </>
  );
};

export default ServiceOptions;
