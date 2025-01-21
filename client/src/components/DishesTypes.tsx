"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import ButtonDetails from "@/components/buttons/ButtonDetails";
import { motion } from "framer-motion";
import { Pagination } from "@nextui-org/react";

interface DishesTypesProps {
  dishes: Record<string, string | number>[];
}

type DishType = {
  image: string;
  name: string;
  description: string;
};

const DishesTypes: React.FC<DishesTypesProps> = ({ dishes }) => {
  const [page, setPage] = useState<number>(1);
  const initialPages = 2;

  const totalPages = useMemo(() => {
    return Math.ceil(dishes.length / initialPages) ?? 0;
  }, [dishes]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return dishes.slice(start, end) ?? [];
  }, [page, dishes]);

  const [dish, setDish] = useState<DishType>({
    name: dishes[0].name as string,
    image: dishes[0].image as string,
    description: dishes[0].description as string,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.8,
          duration: 1.2,
          ease: "easeInOut",
        },
      }}
      className="flex justify-between xl:h-screen h-fit xl:gap-12 gap-4
       xl:flex-row flex-col container"
    >
      <div
        className="relative lg:w-[70%] h-[85%] w-full flex flex-col
       items-center justify-center gap-8"
      >
        <div className="w-full flex items-center justify-center">
          <div className="relative flex lg:flex-row flex-col items-center justify-center gap-3">
            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  className="lg:w-[25vw] w-[50vw] lg:h-[35vh] h-[35vh] relative opacity-70 
                 ease-in-out duration-300 transition-all hover:opacity-100"
                  onClick={() => {
                    setDish({
                      name: item.name as string,
                      description: item.description as string,
                      image: item.image as string,
                    });
                  }}
                >
                  {item.image && (
                    <Image
                      src={item.image as string}
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 600px) 100vw, 50vw"
                      className="cursor-pointer select-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

      <div className="xl:w-[43%] w-full flex relative xl:mt-4 mt-0 group">
        <div className="flex flex-col gap-2">
          <div
            className="w-full xl:h-[60vh] xl:w-full lg:w-[40%] md:w-[60%]
           xl:mx-0 mx-auto h-[40vh] cursor-pointer relative select-none ease-in-out
            duration-300 transition-all opacity-75 group-hover:opacity-100"
          >
            <Image
              src={dish.image}
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
              priority
              className="object-cover xl:object-contain"
            ></Image>
          </div>

          <div className="flex items-center flex-col text-center xl:gap-5 gap-2">
            <h1 className="lg:text-3xl text-2xl text-center text-white font-bold">
              {dish.name}
            </h1>

            <div className="flex flex-col xl:gap-4 gap-1">
              <p className="lg:text-[15px] text-[14px] text-center text-white/70">
                {dish.description}
              </p>

              <ButtonDetails />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DishesTypes;
