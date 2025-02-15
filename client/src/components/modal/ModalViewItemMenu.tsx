"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import Image from "next/image";
import { Product } from "@/utils";

interface ModalViewItemMenuProps {
  product: Product;
}

const ModalViewItemMenu: React.FC<ModalViewItemMenuProps> = ({ product }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        onClick={onOpen}
        className={`relative md:w-[60%] w-[60%] md:h-[200px] h-[150px]
       flex items-center mx-auto ${
         product.stock === 0 && "opacity-50 pointer-events-none cursor-default"
       }`}
      >
        <Tooltip
          content={`${
            product.stock === 0
              ? "The item is out of stock"
              : "Click to view details"
          }`}
          className="dark:text-white text-black"
        >
          {product && product.image && (
            <Image
              src={product.image}
              alt="image"
              priority
              sizes="(max-width:600px) 100vw, 50vw"
              fill
              className={`select-none
          opacity-75 group-hover:opacity-100 ease-in-out duration-250 transition-all ${
            product.stock === 0 &&
            "opacity-50 pointer-events-none cursor-default"
          }`}
            />
          )}
        </Tooltip>
      </div>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="2xl"
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader>Dish Details</ModalHeader>

              <ModalBody
                className="relative flex lg:flex-row flex-col
               justify-between lg:px-4 px-2 lg:text-base text-[14px] lg:gap-2 gap-6"
              >
                <div
                  className="lg:w-[35%] w-full relative flex 
                items-center justify-center"
                >
                  <div
                    className="relative lg:w-[60%] w-[50%] lg:h-[130px] h-[150px]
                 flex items-center mx-auto"
                  >
                    {product && product.image && (
                      <Image
                        src={product.image}
                        alt="image"
                        priority
                        sizes="(max-width:600px) 100vw, 50vw"
                        fill
                        className="select-none opacity-75 group-hover:opacity-100 ease-in-out 
                        duration-250 transition-all"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative lg:w-[60%] w-full">
                  <div className="flex flex-col items-center lg:gap-2 gap-1">
                    <div
                      className="relative flex flex-col items-center 
                  text-center lg:text-base text-[15px]"
                    >
                      <h1 className="lg:text-xl text-base font-bold ">
                        {product.name}
                      </h1>

                      <p className="text-black/70 dark:text-white/70 lg:text-[14px] text-[12px]">
                        {product.description}
                      </p>
                    </div>

                    <div className="relative flex flex-col items-center text-center">
                      <p>Ingredients:</p>
                      <p className="lg:text-[14px] text-[12px] text-black/70 dark:text-white/70">
                        {product.ingredients}
                      </p>
                    </div>

                    <div className="relative flex items-center lg:gap-1 lg:flex-row flex-col lg:items-start">
                      <p>Price:</p>
                      <p className="dark:text-green-300 text-green-500 font-bold">
                        {product.price}$
                      </p>
                    </div>
                  </div>

                  <div className="relative flex lg:items-center flex-row gap-1">
                    <p>Items in Stock: </p>
                    <p className="lg:text-xl text-base dark:text-red-400 text-red-500 font-bold">
                      {product.stock}
                    </p>
                  </div>

                  <div className="relative flex flex-row gap-2 items-center justify-end">
                    <p className="lg:text-xl text-base font-bold">
                      {product?.average_rating ? product.average_rating : 0}⭐
                    </p>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="flex lg:justify-end lg:items-end justify-center items-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black text-white"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalViewItemMenu;
