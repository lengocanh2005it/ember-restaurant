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
  Divider,
  Tooltip,
  Badge,
} from "@nextui-org/react";
import { BellIcon } from "lucide-react";

interface ModalEditReservationProps {
  message: string;
}

const ModalEditReservation: React.FC<ModalEditReservationProps> = ({
  message,
}) => {
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
                Message
              </ModalHeader>

              <ModalBody>
                <p className="lg:text-base text-[15px] dark:text-white/80 text-black/80">
                  {message}
                </p>
              </ModalBody>

              <ModalFooter className="flex lg:justify-end justify-center">
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

export default ModalEditReservation;
