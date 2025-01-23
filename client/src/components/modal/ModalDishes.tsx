"use client";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { Button } from "@heroui/react";
import { useAppStore, useProductStore } from "@/store";

const ModalDishes = () => {
  const { product } = useProductStore();
  const { isClose, setIsClose } = useAppStore();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-shadow z-[999] ${
        isClose ? "hidden" : ""
      }`}
    >
      <div
        className="relative flex xl:flex-row flex-col mb-3 xl:mb-0 xl:gap-12 p-4 xl:py-24 w-[90vw]
       bg-black/50 shadow-cyan-50 shadow-sm h-fit items-center rounded-[20px]"
      >
        <div className="xl:w-[45%] w-full h-[50vh] relative select-none">
          {product && product.image && (
            <Image
              src={product.image}
              layout="fill"
              alt=""
              priority
              sizes="(max-width: 600px) 100vw, 50vw"
            />
          )}
        </div>

        <div className="flex flex-col gap-2 xl:w-[50%] w-full">
          <div className="relative flex flex-col items-center text-center">
            <h1
              className="xl:text-4xl text-2xl text-accent hover:text-accent-hover 
            font-bold cursor-pointer"
            >
              {product?.name}
            </h1>
            <p className="text-white/50 xl:text-base text-[14px]">
              {product?.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p>
              Price:{" "}
              <span className="text-accent xl:text-3xl text-xl font-bold">
                {product?.price}$
              </span>
            </p>
            <p className="text-[14px]">
              Ingredients:{" "}
              <span className="italic xl:text-[17px] text-[14px]">
                {product?.ingredients}
              </span>
            </p>
          </div>

          <Button
            color="primary"
            className="dark:bg-white dark:text-black text-white"
            onPress={() => {
              setIsClose(true);
            }}
            startContent={<XIcon />}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalDishes;
