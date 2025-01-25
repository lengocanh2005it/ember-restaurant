"use client";
import ModalBank from "@/components/modal/ModalBank";
import { useUserStore } from "@/store";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import React from "react";

type Data = {
  orderId: string;
  paymentMethod: string;
  totalPrice: number;
  products: string;
};

interface ModalPaymentProps {
  data: Data;
}

const ModalPayment: React.FC<ModalPaymentProps> = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const query = useQueryClient();
  const { user } = useUserStore();

  const handleClick = () => {
    query.removeQueries({
      queryKey: ["orderData", user?.id!],
      exact: true,
    });
  };

  const rows = [
    { key: 1, title: "Order ID", value: "#" + data.orderId },
    { key: 2, title: "Order Details", value: data.products },
    { key: 3, title: "Total Price", value: data.totalPrice + " $" },
    { key: 4, title: "Payment Method", value: data.paymentMethod },
  ];

  return (
    <>
      <Tooltip
        content="Click to pay"
        showArrow
        className="dark:text-white text-black"
      >
        <Chip
          color="danger"
          variant="faded"
          startContent={<XIcon size={18} />}
          onClick={() => {
            onOpen();
            handleClick();
          }}
          className="cursor-pointer"
        >
          Not paid
        </Chip>
      </Tooltip>

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
              <ModalHeader className="flex items-center justify-center text-center">
                Make A Payment
              </ModalHeader>

              <ModalBody className="text-base">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className="flex flex-col gap-1 p-2 rounded-lg border
                  dark:border-white/20 border-black/20"
                  >
                    <h1 className="dark:text-white/70 text-black/70">
                      {row.title}
                    </h1>

                    <p className="lg:text-base text-[15px]">{row.value}</p>
                  </div>
                ))}

                {data.paymentMethod === "Credit Card" ? (
                  <div className="flex items-center justify-center">
                    <ModalBank />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center text-center
                   flex-col lg:gap-2 gap-1"
                  >
                    <Chip color="danger">Note:</Chip>

                    <p className="dark:text-white/80 text-black/80">
                      You need go to our restaurant to pay your order!
                    </p>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="relative flex flex-col items-center justify-center">
                <Button
                  color="primary"
                  onPress={onClose}
                  className="dark:bg-white dark:text-black bg-black text-white"
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

export default ModalPayment;
