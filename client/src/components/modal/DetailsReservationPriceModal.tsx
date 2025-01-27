"use client";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/utils";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  useDisclosure,
} from "@heroui/react";
import React, { useMemo, useState } from "react";

interface DetailsReservationPriceProps {
  tables: Table[];
}

const typeMap = {
  normal: "Normal",
  vip: "VIP",
};

const DetailsReservationPriceModal: React.FC<DetailsReservationPriceProps> = ({
  tables,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState<number>(1);

  const initialPages = 2;

  const totalPages = useMemo(() => {
    return Math.ceil((tables?.length ?? 0) / initialPages) ?? 0;
  }, [tables]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return tables.slice(start, end) ?? [];
  }, [page, tables]);

  return (
    <>
      <Chip
        color="primary"
        className="dark:bg-white dark:text-black cursor-pointer opacity-60 
        hover:opacity-100 duration-250 ease-in-out transition-all"
        onClick={onOpen}
      >
        See Price Details
      </Chip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="lg"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        placement="center"
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Price Details Of Reservation
              </ModalHeader>

              <ModalBody className="flex flex-col lg:gap-4 gap-3 relative">
                <div className="flex flex-col gap-2">
                  {items.map((table) => (
                    <div
                      key={table.id}
                      className="flex flex-col gap-1 p-2 rounded-lg border dark:border-white/20
                       border-black/20"
                    >
                      <h1 className="lg:text-xl text-base font-medium">
                        {table.name}
                      </h1>

                      <div className="px-2">
                        {Array.from({ length: 2 }, (_, index) => {
                          if (index === 0) {
                            return {
                              name: "Type",
                              value:
                                typeMap[table.type as keyof typeof typeMap],
                            };
                          } else if (index === 1) {
                            return {
                              name: "Price",
                              value: table.price + "$",
                            };
                          } else {
                            return {};
                          }
                        }).map((element, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between 
                         lg:text-[14px] text-[13px]"
                          >
                            <p>{element.name}</p>
                            <p>{element.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {tables.length !== 0 && (
                    <div
                      className="relative flex lg:items-start lg:justify-start items-center 
                    justify-center"
                    >
                      <Pagination
                        page={page}
                        total={totalPages}
                        showControls
                        showShadow
                        isCompact
                        classNames={{
                          cursor: "dark:bg-white dark:text-black text-white",
                        }}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  )}
                </div>

                <div className="relative flex items-center justify-between">
                  <p className="dark:text-white/80 text-black/80 lg:text-base text-[15px]">
                    Total Price:
                  </p>

                  <p className="font-medium lg:text-xl text-base">
                    {Number(
                      tables.reduce(
                        (acc, curr) => acc + parseFloat(curr.price.toString()),
                        0
                      )
                    ).toFixed(2)}
                    $
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="dark:bg-white dark:text-black w-fit mx-auto"
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

export default DetailsReservationPriceModal;
