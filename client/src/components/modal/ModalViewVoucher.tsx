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
  Card,
  CardBody,
} from "@nextui-org/react";
import { EyeIcon } from "lucide-react";
import { Discount } from "@/utils";

interface ModalViewVoucherProps {
  voucher: Discount;
}

const ModalViewVoucher: React.FC<ModalViewVoucherProps> = ({ voucher }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const details = [
    {
      key: 2,
      title: "Type",
      value: voucher.type === "fixed" ? "Fixed Amount" : "Percentage",
    },
    {
      key: 3,
      title: "Value",
      value:
        voucher.value +
        (voucher.type === "percentage"
          ? "%"
          : voucher.currency === "vnd"
          ? " VND"
          : " USD"),
    },
    {
      key: 4,
      title: "Currency",
      value: voucher.currency === "usd" ? "USD" : "VND",
    },
    { key: 5, title: "Start Date", value: voucher.start_date.split("T")[0] },
    { key: 6, title: "End Date", value: voucher.end_date.split("T")[0] },
  ];

  return (
    <>
      <Tooltip
        content="View Detail"
        className="dark:text-white text-black"
        showArrow
      >
        <EyeIcon
          className="cursor-pointer opacity-50 hover:opacity-100 duration-250 ease-in-out
                transition-opacity"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
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
              <ModalHeader className="flex flex-col gap-1">
                View Voucher
              </ModalHeader>

              <ModalBody>
                {details.map((detail) => (
                  <Card
                    className="border dark:border-white/30"
                    key={detail.key}
                  >
                    <CardBody
                      className="flex flex-row
                   items-center justify-between"
                    >
                      <p>{detail.title}</p>
                      <p>{detail.value}</p>
                    </CardBody>
                  </Card>
                ))}

                {voucher.description && (
                  <Card className="border dark:border-white/30">
                    <CardBody
                      className="flex flex-row
                   items-center justify-between"
                    >
                      <p>Description</p>
                      <p>{voucher.description}</p>
                    </CardBody>
                  </Card>
                )}
              </ModalBody>

              <ModalFooter>
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

export default ModalViewVoucher;
