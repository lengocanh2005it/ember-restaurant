"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { TrashIcon } from "lucide-react";
import { useDeleteEvent } from "@/hooks/use-delete-event";

interface ModalConfirmDeleteEventProps {
  eventId: string;
}

const ModalConfirmDeleteEvent: React.FC<ModalConfirmDeleteEventProps> = ({
  eventId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate: mutateDeleteEvent } = useDeleteEvent();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      mutateDeleteEvent(eventId);
    }, 2500);
  };

  return (
    <>
      <Tooltip
        content="Delete"
        showArrow
        className="dark:text-white text-black"
      >
        <TrashIcon
          className="cursor-pointer opacity-50 hover:opacity-100 
              duration-250 ease-in-out transition-opacity select-none"
          onClick={onOpen}
        />
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Confirmation
              </ModalHeader>

              <ModalBody className="flex flex-col lg:text-left text-center">
                <h1 className="lg:text-base text-[15px] uppercase font-bold">
                  Do you want to delete this event?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you click &quot;Yes&quot;, this event will be deleted
                  permanently in system&apos;database.
                </p>
              </ModalBody>

              <ModalFooter className="flex lg:items-end lg:justify-end justify-center items-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
                  onPress={onClose}
                >
                  Cancel
                </Button>

                {isLoading ? (
                  <>
                    <Button
                      color="primary"
                      className="dark:bg-white dark:text-black"
                      isLoading
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                      onPress={handleClick}
                    >
                      Submit
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalConfirmDeleteEvent;
