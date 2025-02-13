"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { SquarePenIcon } from "lucide-react";
import UpdateDiscountForm from "@/components/form/UpdateDiscountForm";
import { Discount } from "@/utils";

interface ModalUpdateDiscountProps {
  discount: Discount;
}

const ModalUpdateDiscount: React.FC<ModalUpdateDiscountProps> = ({
  discount,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="Edit" className="bg-white text-black">
        <SquarePenIcon className="cursor-pointer" onClick={onOpen} />
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
              <ModalHeader className="lg:text-left text-center flex flex-col">
                Update Discount
              </ModalHeader>

              <ModalBody>
                <UpdateDiscountForm onClose={onClose} discount={discount} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalUpdateDiscount;
