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

interface ModalNoteCartProps {
  note: string;
}

const ModalNoteCart: React.FC<ModalNoteCartProps> = ({ note }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        className="dark:bg-white dark:text-black text-white"
      >
        See Note
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
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
        onOpenChange={onOpenChange}
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-center">
                Note About Cart
              </ModalHeader>

              <ModalBody>
                <p className="lg:text-base text-[15px] dark:text-white/90 text-black/90">
                  {note}
                </p>
              </ModalBody>

              <ModalFooter className="flex items-center justify-center">
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

export default ModalNoteCart;
