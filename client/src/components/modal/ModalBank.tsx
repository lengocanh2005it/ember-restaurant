import React from "react";
import CreditCard from "@/components/CreditCard";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import { BanknoteIcon } from "lucide-react";

const ModalBank: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Chip
        color="primary"
        className="dark:bg-white dark:text-black px-2 cursor-pointer
         opacity-60 hover:opacity-100
        transition-opacity duration-250 ease-in-out"
        startContent={<BanknoteIcon />}
        onClick={onOpen}
      >
        Choose your bank
      </Chip>

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
        <ModalContent className="dark:text-white text-black p-4">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Bank Information
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

export default ModalBank;
