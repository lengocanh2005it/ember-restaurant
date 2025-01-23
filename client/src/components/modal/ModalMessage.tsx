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
} from "@heroui/react";
import { MessageSquareTextIcon } from "lucide-react";

interface ModalMessageProps {
  content: string;
}

const ModalMessage: React.FC<ModalMessageProps> = ({ content }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <MessageSquareTextIcon
        onClick={onOpen}
        className="opacity-50 hover:opacity-100 transition-opacity duration-300
      ease-in-out cursor-pointer"
      />

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
                Note about the order
              </ModalHeader>

              <ModalBody>
                <p>{content}</p>
                <Divider className="my-4" />
              </ModalBody>

              <ModalFooter>
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

export default ModalMessage;
