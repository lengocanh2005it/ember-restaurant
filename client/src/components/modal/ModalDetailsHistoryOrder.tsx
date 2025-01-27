import DetailsOfOrder from "@/components/DetailsOfOrder";
import { Order } from "@/utils";
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
import { format } from "date-fns";
import { EyeIcon } from "lucide-react";
import React from "react";

interface ModalDetailsHistoryOrderProps {
  order: Order;
}

const ModalDetailsHistoryOrder: React.FC<ModalDetailsHistoryOrderProps> = ({
  order,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const array = [
    { key: 1, name: "ID", value: "#" + order.id },
    ...(order.discounts && order.discounts.length !== 0
      ? [
          {
            key: 6,
            name: "Original Price",
            value: order.total_price + "$",
          },
        ]
      : []),
    {
      key: 2,
      name: "Order Details",
      value: order.order_details
        .map((detail) => detail.product.name + " (" + detail.quantity + ")")
        .join(", "),
    },
    {
      key: 3,
      name: "Date Time",
      value: format(
        order?.createdAt ? order.createdAt : new Date(),
        "dd/MM/yyyy HH:mm:yy"
      ),
    },
    {
      key: 4,
      name: "Status",
      value: order.status.charAt(0).toUpperCase() + order.status.substring(1),
    },
    ...(order.discounts && order.discounts.length !== 0
      ? [
          {
            key: 7,
            name: "Discount",
            value:
              order.discounts.map((discount) => discount.value).join(",") + "%",
          },
        ]
      : []),
    {
      key: 5,
      name: "Total Price",
      value:
        order.discounts && order.discounts.length !== 0
          ? Number(
              order.total_price -
                (order.total_price *
                  order.discounts
                    .map((order) => order.value)
                    .reduce((acc, curr) => {
                      return acc + curr;
                    }, 0)) /
                  100
            ).toFixed(2) + "$"
          : order.total_price + "$",
    },
    ...(order.note ? [{ key: 8, name: "Note", value: order.note }] : []),
  ];

  return (
    <>
      <Tooltip content="View" showArrow className="dark:text-white text-black">
        <span onClick={onOpen}>
          <EyeIcon
            className="opacity-60 hover:opacity-100 
            duration-300 ease-in-out transition-opacity cursor-pointer"
          />
        </span>
      </Tooltip>

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
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Order Details
              </ModalHeader>

              <ModalBody>
                {array.map((order) => (
                  <div
                    className={`flex p-2 rounded-lg border dark:border-white/30 border-black/20 ${
                      order.key === 2 || order.key === 8
                        ? "flex-col gap-1"
                        : "flex-row items-center justify-between gap-2"
                    }`}
                    key={order.key}
                  >
                    <p className="lg:text-[16px] text-[14px] dark:text-white/80 text-black/70">
                      {order.name}
                    </p>

                    <h1 className="lg:text-base text-[15px] font-normal">
                      {order.value}
                    </h1>
                  </div>
                ))}

                <div className="relative flex md:items-end md:justify-end items-center justify-center">
                  <DetailsOfOrder order={order} />
                </div>
              </ModalBody>

              <ModalFooter className="flex items-center justify-center">
                <Button
                  color="primary"
                  onPress={onClose}
                  className="dark:bg-white dark:text-black"
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

export default ModalDetailsHistoryOrder;
