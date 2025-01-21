"use client";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { Order } from "@/utils/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { format } from "date-fns";
import React from "react";

interface ModalViewOrdersOfCustomerProps {
  order: Order;
}

const methodMap = {
  cash: "Pay In Cash",
  card: "Credit Card",
};

const deliveryMap = {
  home_delivery: "Home Delivery",
  pick_up: "Pick Up",
};

const ModalViewOrdersOfCustomer: React.FC<ModalViewOrdersOfCustomerProps> = ({
  order,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const details = [
    {
      key: 6,
      name: "Date",
      value: format(order.createdAt.toLocaleString(), "dd/MM/yyyy"),
    },
    {
      key: 2,
      name: "Delivery Method",
      value: deliveryMap[order.delivery_method as keyof typeof deliveryMap],
    },
    {
      key: 3,
      name: "Payment Method",
      value:
        methodMap[order?.payment?.payment_method as keyof typeof methodMap],
    },
    {
      key: 5,
      name: "Payment Status",
      value: order.is_paid === true ? "Paid" : "Not Paid",
    },
    ...(order.delivery_address
      ? [
          {
            key: 4,
            name: "Delivery Address",
            value: order.delivery_address,
          },
        ]
      : []),
    ...(order.discounts && order.discounts.length !== 0
      ? [
          {
            key: 7,
            name: "Discounts",
            value: order.discounts
              .map(
                (discount) =>
                  discount.value +
                  `${discount.type === "percentage" ? "%" : " USD"}`
              )
              .join(","),
          },
        ]
      : []),
    { key: 1, name: "Total Price", value: order.total_price + "$" },
    ...(order.note
      ? [
          {
            key: 10,
            name: "Note About Order",
            value: order.note,
          },
        ]
      : []),
  ];

  return (
    <>
      <Tooltip content="View" className="dark:text-white text-black">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="blur"
        placement="center"
        isOpen={isOpen}
        size="lg"
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
                View Order
              </ModalHeader>

              <ModalBody>
                {details.map((detail) => (
                  <div
                    key={detail.key}
                    className={`flex ${
                      detail.key === 6 ||
                      detail.key === 3 ||
                      detail.key === 5 ||
                      detail.key === 1 ||
                      detail.key === 7
                        ? "flex-row items-center justify-between"
                        : "flex-col"
                    } p-2 border dark:border-white/20
                 border-black/20 rounded-lg`}
                  >
                    <h1 className="lg:text-[15px] text-[14px] dark:text-white/70 text-black/70">
                      {detail.name}
                    </h1>
                    <p className="lg:text-base text-[13px]">{detail.value}</p>
                  </div>
                ))}
              </ModalBody>

              <ModalFooter
                className={`relative flex items-center lg:flex-row
            flex-col gap-2`}
              >
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
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

export default ModalViewOrdersOfCustomer;
