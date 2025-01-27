import CreditCard from "@/components/CreditCard";
import { useAppStore } from "@/store";
import { emitCreatingPaymentOfUser } from "@/utils/socket";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import React from "react";

const ModalShowPayments: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { type } = useAppStore();

  const handleClick = () => {
    onOpen();
    emitCreatingPaymentOfUser(type as "order" | "reservation");
  };

  return (
    <>
      <Chip
        onClick={handleClick}
        color="primary"
        className="dark:bg-white dark:text-black bg-black text-white cursor-pointer"
      >
        Payment
      </Chip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
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
                Make A Payment
              </ModalHeader>

              <ModalBody>
                <CreditCard onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalShowPayments;
