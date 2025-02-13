"use client";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { BellIcon } from "lucide-react";
import React from "react";

interface ModalMessageOrderProps {
  message: string;
}

const ModalMessageOrder: React.FC<ModalMessageOrderProps> = ({ message }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Badge content="" color="danger">
        <Tooltip
          content="New Message"
          showArrow
          className="dark:text-white text-black"
        >
          <BellIcon
            onClick={onOpen}
            className="opacity-60 hover:opacity-100
                duration-250 ease-in-out
                 transition-opacity cursor-pointer"
          />
        </Tooltip>
      </Badge>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
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
                New Message
              </ModalHeader>

              <ModalBody>
                <p
                  className="lg:text-base text-[14px] dark:text-white/80
                 text-black/80 lg:text-left text-center"
                >
                  {message}
                </p>
              </ModalBody>

              <ModalFooter className="relative flex lg:justify-end lg:items-end justify-center items-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black text-white"
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

export default ModalMessageOrder;
