"use client";
import { DeleteOrderOptionsDto } from "@/api/orders/utils/types";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";
import ModalUpdateOrder from "@/components/modal/ModalUpdateOrder";
import { useDeleteOrder } from "@/hooks/use-delete-order";
import { useUserStore } from "@/store";
import { Discount, Order } from "@/utils/types";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { TrashIcon } from "lucide-react";
import React from "react";

type Data = {
  original_price: number;
  delivery_address?: string;
  delivery_method: string;
  discounts?: Discount[];
  orderId?: string;
  phone_number: string;
  note?: string;
  is_paid: boolean;
};

interface ModalOrderProps {
  order: Order;
}

const deliveryMap = {
  home_delivery: "Home Delivery",
  pick_up: "Pick Up",
};

const ModalOrderDetails: React.FC<ModalOrderProps> = ({ order }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { user } = useUserStore();

  const { mutate: mutateDeleteOrder } = useDeleteOrder(user?.id!);

  const dataArray = [
    ...(order.discounts?.length !== 0
      ? [{ id: 1, title: "Original Price", value: order.total_price + "$" }]
      : []),
    ...(order.delivery_address
      ? [
          {
            id: 2,
            title: "Delivery Address",
            value: order.delivery_address,
          },
        ]
      : []),
    {
      id: 3,
      title: "Delivery Method",
      value: deliveryMap[order.delivery_method as keyof typeof deliveryMap],
    },
    {
      id: 6,
      title: "Phone Number",
      value: order?.user?.phone,
    },
    ...(order.discounts?.length !== 0
      ? [
          {
            id: 4,
            title: "Discount",
            value: order.discounts
              ?.map((discount) => discount.value + "%")
              .join(","),
          },
        ]
      : []),
    {
      id: 5,
      title: "Total Price",
      value:
        order.discounts && order.discounts.length !== 0
          ? Number(
              order.total_price -
                (order.total_price *
                  order.discounts
                    .map((data) => data.value)
                    .reduce((acc, curr) => {
                      return acc + curr;
                    }, 0)) /
                  100
            ).toFixed(2) + "$"
          : order.total_price + "$",
    },
    ...(order.note
      ? [
          {
            id: 7,
            title: "Note",
            value: order.note,
          },
        ]
      : []),
  ];

  return (
    <>
      <VerticalDotsIcon onClick={onOpen} />

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
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
                Options For Order
              </ModalHeader>

              <ModalBody>
                <h1 className="font-bold dark:text-white/80 text-black/80 lg:text-left text-center">
                  More Information About Order
                </h1>

                {dataArray.map((item) => (
                  <div
                    className="flex lg:flex-row flex-col 
                lg:items-center justify-between gap-1 p-2 rounded-lg border dark:border-white/20 border-black/20"
                    key={item.id}
                  >
                    <h1 className="text-base dark:text-white/80 text-black/80">
                      {item.title}
                    </h1>

                    <span className="text-base font-medium">{item.value}</span>
                  </div>
                ))}
              </ModalBody>

              <ModalFooter className="flex items-center justify-between">
                {(order.status === "pending" || order.status === "error") && (
                  <div className="flex items-center gap-2">
                    <Tooltip
                      content="Delete"
                      className="dark:text-white text-black"
                    >
                      <TrashIcon
                        className="opacity-50 hover:opacity-100 
                  transition-opacity duration-300 ease-in-out cursor-pointer"
                        onClick={() => {
                          onClose();
                          if (order.id) {
                            const payload: DeleteOrderOptionsDto = {
                              orderId: order.id,
                              modeOption: "normal",
                              userId: user?.id!,
                            };
                            mutateDeleteOrder(payload);
                          }
                        }}
                      />
                    </Tooltip>

                    {order.status === "pending" && !order.is_paid && (
                      <ModalUpdateOrder onCloseFC={onClose} />
                    )}
                  </div>
                )}

                <Button
                  color="primary"
                  className="dark:bg-white bg-black
                 dark:text-black text-white"
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

export default ModalOrderDetails;
