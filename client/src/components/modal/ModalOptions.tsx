import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/components/icons/VerticalDotsIcon";
import { EyeIcon } from "lucide-react";

const ModalOptions = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button isIconOnly onPress={() => onOpen()}>
        <VerticalDotsIcon />
      </Button>

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
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
              <ModalHeader className="flex flex-col gap-1">Options</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <p>View</p>
                    <EyeIcon />
                  </div>

                  <p>See details about the order</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  className="dark:bg-white dark:text-black bg-black text-white"
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

export default ModalOptions;
