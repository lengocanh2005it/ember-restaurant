"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDiscount } from "@/hooks/use-discounts-of-user";
import { useDiscountStore, useUserStore } from "@/store";
import { DiscountWithQuantity } from "@/utils";
import {
  Button,
  Checkbox,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Autoplay from "embla-carousel-autoplay";
import { Calendar, PencilLineIcon } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface VoucherListProps {
  content: string;
  selectedVouchers?: DiscountWithQuantity[];
  setSelectedVouchers?: Dispatch<SetStateAction<DiscountWithQuantity[]>>;
}

type State = {
  id: string;
  value: boolean;
};

const VoucherList: React.FC<VoucherListProps> = ({
  content,
  selectedVouchers,
}) => {
  const [checkedState, setCheckedState] = useState<State[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useUserStore();
  const { setDiscount } = useDiscountStore();
  const [discounts, setDiscounts] = useState<DiscountWithQuantity[]>([]);
  const [selectedVoucher, setSelectedVoucher] =
    useState<DiscountWithQuantity | null>(null);

  const { data } = useDiscount(user?.id!);

  useEffect(() => {
    if (data) {
      setDiscounts(data);
      setCheckedState(Array(data.length).fill(false));
    }
  }, [data]);

  const toggleCheckbox = (
    index: number,
    id: string,
    voucher: DiscountWithQuantity
  ) => {
    const updatedCheckedState = checkedState.map((_, i) => ({
      id,
      value: i === index ? true : false,
    }));

    setCheckedState(updatedCheckedState);

    setSelectedVoucher(voucher);
  };

  const handleCardClick = (
    index: number,
    voucher: DiscountWithQuantity,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    toggleCheckbox(index, voucher.discount.id, voucher);
  };

  const handleCheckBoxClick = (
    index: number,
    id: string,
    voucher: DiscountWithQuantity
  ) => {
    toggleCheckbox(index, id, voucher);
  };

  return (
    <>
      {content === "pencil" ? (
        <>
          <PencilLineIcon
            className="transition-all duration-300 
          ease-in-out opacity-50 hover:opacity-100 cursor-pointer"
            onClick={() => {
              onOpen();
            }}
          />
        </>
      ) : (
        <>
          <Chip
            onClick={() => {
              onOpen();
            }}
            className="cursor-pointer dark:bg-white dark:text-black"
            color="primary"
          >
            See All Vouchers
          </Chip>
        </>
      )}

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className="flex flex-col gap-1 text-black dark:text-white
               lg:text-left text-center"
              >
                All Your Vouchers
              </ModalHeader>

              <ModalBody className="lg:py-6 py-12">
                {discounts.length === 0 ? (
                  <>
                    <h1 className="text-center dark:text-white text-black">
                      You don&apos;t have any discounts!
                    </h1>
                  </>
                ) : (
                  <>
                    <Carousel
                      opts={{
                        align: "start",
                      }}
                      plugins={[
                        Autoplay({
                          delay: 5000,
                          stopOnInteraction: true,
                          stopOnMouseEnter: true,
                        }),
                      ]}
                      orientation="vertical"
                      className="w-full"
                    >
                      <CarouselContent className="-mt-2 lg:h-[170px] h-[180px] relative">
                        {discounts.map((discount, index) => (
                          <CarouselItem key={index} className="h-full relative">
                            <div className="select-none h-full relative">
                              <Card
                                className="cursor-pointer h-full relative 
                              dark:text-white text-black
                              dark:bg-transparent border dark:border-white/30 border-black/10"
                              >
                                <CardContent
                                  className="flex flex-col 
                                  p-4 justify-between w-full
                                  border border-black/10 h-full rounded-lg text-base bg-white 
                                  dark:bg-transparent"
                                  onClick={(e) => {
                                    handleCardClick(index, discount, e);
                                  }}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <h5 className="lg:text-base text-[14px] font-semibold mb-2">
                                      Voucher
                                    </h5>

                                    <Checkbox
                                      isSelected={
                                        (checkedState[index]?.value ?? false) ||
                                        selectedVouchers?.some(
                                          (voucher) =>
                                            voucher.discount.id ===
                                            discount.discount.id
                                        )
                                      }
                                      onValueChange={() =>
                                        handleCheckBoxClick(
                                          index,
                                          discount.discount.id,
                                          discount
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="flex flex-col gap-3">
                                    <div
                                      className="flex lg:flex-row flex-col gap-3 lg:items-center
                                     lg:justify-between"
                                    >
                                      <p
                                        className=" lg:text-base 
                                        text-[14px] font-medium"
                                      >
                                        Value:{" "}
                                        <span className="font-semibold">
                                          {discount.discount.value}%
                                        </span>
                                      </p>

                                      <p
                                        className="lg:text-base 
                                        text-[14px] font-medium"
                                      >
                                        Quantity: {discount.quantity}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Calendar />
                                      <p
                                        className="lg:text-base 
                                        text-[14px] font-medium "
                                      >
                                        Start Date:{" "}
                                        <span className="font-semibold">
                                          {
                                            discount.discount.start_date.split(
                                              "T"
                                            )[0]
                                          }
                                        </span>
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Calendar />
                                      <p
                                        className="lg:text-base 
                                        text-[14px] font-medium"
                                      >
                                        End Date:{" "}
                                        <span className="font-semibold">
                                          {
                                            discount.discount.end_date.split(
                                              "T"
                                            )[0]
                                          }
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>

                      <CarouselPrevious
                        className="opacity-50 hover:opacity-100 cursor-pointer
                   ease-in-out transition-all duration-300 absolute"
                      />
                      <CarouselNext
                        className="opacity-50 hover:opacity-100 ease-in-out
                   transition-all duration-300 cursor-pointer absolute"
                      />
                    </Carousel>
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    setTimeout(() => {
                      setSelectedVoucher(null);
                      setCheckedState([]);
                    }, 1000);
                  }}
                  className="dark:bg-white dark:text-black"
                >
                  Close
                </Button>

                {checkedState.some((isChecked) => isChecked) && (
                  <Button
                    color="primary"
                    className="dark:bg-white dark:text-black text-white"
                    onPress={() => {
                      setDiscount(selectedVoucher);
                      onClose();
                    }}
                  >
                    Choose
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default VoucherList;
