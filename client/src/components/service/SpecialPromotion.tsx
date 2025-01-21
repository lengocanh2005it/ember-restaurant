"use client";
import React from "react";
import IconsWelcome from "@/components/icons/IconsWelcome";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";

const SpecialPromotion: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col xl:gap-8 gap-2 text-base relative">
      <motion.h1
        initial={{ opacity: 0, x: -200 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            delay: 0.8,
            duration: 1.4,
            ease: "easeInOut",
          },
        }}
        className="lg:text-4xl text-2xl
        font-bold lg:text-left text-center"
      >
        Special Promotions
      </motion.h1>

      <div
        className="flex xl:gap-4 xl:p-2 justify-between h-[600px] 
      w-full xl:flex-row flex-col"
      >
        <div
          className="relative xl:w-[50%] w-full h-full flex flex-col 
        xl:p-2 order-2 xl:order-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.8,
                duration: 1.3,
                ease: "easeInOut",
              },
            }}
            className="relative h-[80%] flex flex-col xl:gap-8 gap-4 items-center 
            justify-center xl:text-xl text-base text-center text-white/70"
          >
            <p>
              We currently have a{" "}
              <span className="text-accent text-4xl font-bold">20%</span>{" "}
              discount offer for first-time customers at our restaurant.
            </p>
            <p>
              If you meet the criteria, why wait? Take advantage of this
              discount now! 😊
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.8,
                duration: 1.3,
                ease: "easeInOut",
              },
            }}
            className="flex lg:px-6 items-center justify-between lg:flex-row flex-col gap-4"
          >
            <Button className="text-black bg-white px-6">Apply</Button>

            <IconsWelcome
              IconStyles="border border-white/60 rounded-full text-white/70 px-2 py-2
                transition-all duration-300 hover:text-white"
              ContainerStyles="flex items-center justify-between gap-3 text-2xl"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.8,
              duration: 1.3,
              ease: "easeInOut",
            },
          }}
          className="xl:w-[40%] lg:w-[50%] md:w-[60%] xl:mx-0 mx-auto w-full h-full 
          relative order-1 xl:order-none"
        >
          <Image
            src="/assets/reservation-8.jpg"
            alt="image"
            priority
            sizes="(max-width:600px) 100vw, 50vw"
            fill
            className="rounded-[20px] opacity-70 hover:opacity-100 ease-in-out 
            transition-all duration-350 cursor-pointer object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SpecialPromotion;
