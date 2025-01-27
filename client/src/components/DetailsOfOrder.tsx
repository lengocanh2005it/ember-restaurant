"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/utils";
import {
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Pagination,
  useDisclosure,
} from "@heroui/react";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";

interface DetailsOfOrderProps {
  order: Order;
}

const DetailsOfOrder: React.FC<DetailsOfOrderProps> = ({ order }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const initialPages = 3;

  const totalPages = useMemo(() => {
    return Math.ceil((order.order_details.length ?? 0) / initialPages) ?? 0;
  }, [order]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return order.order_details?.slice(start, end) ?? [];
  }, [page, order]);

  return (
    <>
      <Chip
        onClick={onOpen}
        color="primary"
        className="dark:bg-white dark:text-black text-white cursor-pointer opacity-70 duration-250
        ease-in-out transition-opacity hover:opacity-100"
      >
        View Items
      </Chip>

      <Drawer
        isOpen={isOpen}
        placement="right"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
            },
            exit: {
              x: 100,
              opacity: 0,
            },
          },
        }}
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 md:text-left text-center">
                Details Items Of Order
              </DrawerHeader>

              <DrawerBody>
                <div className="flex flex-col gap-1">
                  <div className="flex sm:flex-row flex-col sm:items-center sm:gap-1">
                    <p className="lg:text-[14px] text-[13px] dark:text-white/70 text-black/70">
                      Order ID:
                    </p>

                    <p>#{order.id}</p>
                  </div>

                  <div className="flex sm:flex-row flex-col sm:items-center sm:gap-1">
                    <p className="lg:text-[14px] text-[13px] dark:text-white/70 text-black/70">
                      Date Time:
                    </p>

                    <p>
                      {format(
                        order?.createdAt ? order.createdAt : new Date(),
                        "EEEE, dd/MM/yyyy HH:mm:yy"
                      )}
                    </p>
                  </div>
                </div>

                <Separator className="px-10 dark:bg-white/30 bg-black/60" />

                <div
                  className="flex flex-col gap-3 justify-between items-center
                 py-1 px-2 h-full"
                >
                  <ScrollArea className="max-h-[400px] w-full pr-3">
                    <div className="flex flex-col relative lg:gap-4 gap-2 w-full h-full">
                      {items.map((detail) => (
                        <div
                          key={detail.id}
                          className="p-2 rounded-lg border
                    dark:border-white/20 border-black/20 w-full"
                        >
                          <div
                            className="relative flex sm:flex-row flex-col sm:items-center 
                        sm:justify-between"
                          >
                            <p className="dark:text-white/60 text-black/80">
                              Product:{" "}
                            </p>

                            <p className="font-normal lg:text-base text-[14px]">
                              {detail.product.name} ({detail.quantity})
                            </p>
                          </div>

                          <div
                            className="relative flex sm:flex-row flex-col sm:items-center 
                        sm:justify-between"
                          >
                            <p className="dark:text-white/60 text-black/80">
                              Original Price:{" "}
                            </p>

                            <p className="font-normal lg:text-base text-[14px]">
                              {detail.product.price}$
                            </p>
                          </div>

                          <div
                            className="relative flex sm:flex-row flex-col sm:items-center 
                        sm:justify-between"
                          >
                            <p className="dark:text-white/60 text-black/80">
                              Total Price:{" "}
                            </p>

                            <p className="font-normal lg:text-base text-[14px]">
                              {detail.product.price * detail.quantity}$
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Pagination
                    initialPage={page}
                    total={totalPages}
                    onChange={(page) => setPage(page)}
                    showControls
                    isCompact
                    classNames={{
                      cursor:
                        "dark:bg-white dark:text-black bg-black text-white",
                    }}
                  />
                </div>
              </DrawerBody>

              <DrawerFooter className="relative flex flex-col">
                <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between">
                  <p className="sm:text-[15px] text-[14px] dark:text-white/70 text-black/70">
                    Total Price:
                  </p>

                  <p className="font-bold">{order.total_price}$ (USD)</p>
                </div>

                <div className="flex items-end justify-end relative">
                  <Button
                    color="primary"
                    className="dark:bg-white dark:text-black text-white"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DetailsOfOrder;
