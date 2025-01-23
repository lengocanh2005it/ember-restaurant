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
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { useDeleteNotification } from "@/hooks/use-delete-notification";

interface ModalConfirmDeleteNotificationProps {
  notificationId: string;
}

const ModalConfirmDeleteNotification: React.FC<
  ModalConfirmDeleteNotificationProps
> = ({ notificationId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateDeleteNotification } = useDeleteNotification();

  const handleClick = (notificationId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      mutateDeleteNotification(notificationId);
      setIsLoading(false);
    }, 2500);
  };

  return (
    <>
      <Tooltip
        content="Delete"
        className="dark:text-white text-black"
        color="danger"
      >
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <DeleteIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        size="lg"
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
              <ModalHeader className="lg:text-left text-center flex lg:justify-start justify-center">
                Notification Delete Confirm
              </ModalHeader>

              <ModalBody>
                <div
                  className="flex flex-col gap-2 lg:text-left text-center 
                lg:justify-start justify-center"
                >
                  <h1 className="lg:text-xl text-base uppercase font-bold">
                    Do you want to delete this notification?
                  </h1>

                  <p className="lg:text-base text-[15px] dark:text-white/80 text-black/80">
                    If you delete this notification, it will be disappeared from
                    restaurant&apos;s notifications.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter
                className="relative lg:justify-end 
              lg:items-end justify-center items-center"
              >
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
                      onPress={onClose}
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="danger"
                      onPress={() => {
                        handleClick(notificationId);
                      }}
                    >
                      Delete
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

export default ModalConfirmDeleteNotification;
