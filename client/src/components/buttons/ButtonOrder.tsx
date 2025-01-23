"use client";
import { CreateCartDto } from "@/api/carts/utils/types";
import { useAddCart } from "@/hooks/use-add-cart";
import { useUserStore } from "@/store";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { InputNumber } from "antd";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ButtonOrderProps {
  image: string;
  name: string;
  price: number;
  id: string;
  stock: number;
}

const ButtonOrder: React.FC<ButtonOrderProps> = ({
  image,
  name,
  price,
  id,
  stock,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [number, setNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const { user } = useUserStore();

  const { mutate: mutateAddCart } = useAddCart(user?.id!);

  const handleAddCart = () => {
    const data: CreateCartDto = {
      productId: id,
      userId: user?.id!,
      quantity: number,
      note,
    };

    setIsLoading(true);
    setTimeout(() => {
      mutateAddCart(data);
      setIsLoading(false);
      setNote("");
      onClose();
    }, 2500);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        className="dark:bg-white dark:text-black w-fit lg:mx-0 mx-auto"
      >
        <ShoppingCartIcon /> Order
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          setNumber(1);
        }}
        placement="center"
        size="2xl"
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
        <ModalContent className="text-black dark:text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Cart
              </ModalHeader>

              <ModalBody>
                <div
                  className="relative w-full gap-4 h-full flex flex-col border
                   border-black/10 dark:border-white/10 md:flex-row items-center
                 bg-white rounded-lg overflow-hidden dark:bg-black/10 dark:text-white"
                >
                  <div
                    className="w-full md:w-[50%] lg:h-[170px] h-[150px] relative
                   flex items-center justify-center"
                  >
                    {image && (
                      <Image
                        src={image}
                        alt="dish"
                        priority
                        sizes="(max-width:600px) 100vw, 50vw"
                        className="object-contain rounded-md select-none cursor-pointer"
                        fill
                      />
                    )}
                  </div>

                  <div
                    className="w-full md:w-[55%] flex flex-col justify-center 
                  p-4 lg:gap-8 gap-6 text-base"
                  >
                    <h1
                      className="text-center lg:text-2xl text-xl
                       font-medium text-black/80
                     dark:text-white/90 break-words"
                    >
                      {name}
                    </h1>

                    <div className="flex flex-col gap-3">
                      <p className="text-gray-600 dark:text-white/60">
                        Price:{" "}
                        <span className="font-bold text-xl dark:text-green-300 text-green-500">
                          {price}$
                        </span>
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-600  dark:text-white/60">
                          Quantity:{" "}
                        </span>
                        <InputNumber
                          defaultValue={number}
                          className="w-20"
                          type="number"
                          min={1}
                          onChange={(value) => {
                            setNumber(value!);
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="text-black/60 dark:text-white/60">
                          Note about cart (Optional):
                        </p>
                        <Textarea
                          placeholder="Enter note about cart here..."
                          name="note"
                          value={note}
                          onChange={(e) => {
                            setNote(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="flex lg:flex-row flex-col items-end justify-end">
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    setNumber(1);
                  }}
                  className="dark:bg-white dark:text-black text-white"
                >
                  Cancel
                </Button>

                {isLoading ? (
                  <>
                    <Button
                      isLoading
                      color="primary"
                      className="dark:bg-white dark:text-black"
                    >
                      Adding to cart...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      onPress={handleAddCart}
                      className={`dark:bg-white dark:text-black ${
                        stock < number &&
                        "opacity-30 select-none pointer-events-none"
                      }`}
                    >
                      <ShoppingCartIcon />
                      Add to cart
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ButtonOrder;
