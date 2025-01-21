"use client";
import React from "react";
import Image from "next/image";

import { motion } from "framer-motion";

const foods = [
  "/foods/food-1.jpeg",
  "/foods/food-2.webp",
  "/foods/food-3.webp",
  "/foods/food-4.webp",
];

const FoodPhoto = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 w-full h-full relative">
      {foods.map((food, index) => {
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: index * 1.3,
                duration: 1.1,
                ease: "easeInOut",
              },
            }}
            className="md:w-[60%] w-[70%] h-[30vh] xl:w-full lg:w-[70%] xl:mx-0 
            mx-auto relative flex items-center justify-center"
            key={index}
          >
            {food && (
              <Image
                src={food}
                alt=""
                fill
                priority
                sizes="(max-width: 600px) 100vw, 50vw"
                className="rounded-[100px] transition-all duration-300
            opacity-50 hover:opacity-100 cursor-pointer"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FoodPhoto;
