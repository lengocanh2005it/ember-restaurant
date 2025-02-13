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
} from "@heroui/react";
import { useUpdateNotification } from "@/hooks/use-update-notification";
import { UpdateNotificationDto } from "@/api/notifications/utils/types";

interface ModalConfirmUpdateNotificationProps {
  updateNotificationPayload: UpdateNotificationDto;
  onCloseFc: () => void;
}

const ModalConfirmUpdateNotification: React.FC<
  ModalConfirmUpdateNotificationProps
> = ({ updateNotificationPayload, onCloseFc }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateUpdateNotification } = useUpdateNotification();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onCloseFc();
      onClose();
      mutateUpdateNotification(updateNotificationPayload);
    }, 2500);
  };

  return (
    <>
      <Button
        type="submit"
        color="primary"
        className="dark:bg-white dark:text-black"
        onPress={onOpen}
      >
        Update
      </Button>

      <Modal
        backdrop="opaque"
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
              <ModalHeader className="flex flex-col lg:text-left text-center">
                Notification Update Confirm
              </ModalHeader>

              <ModalBody className="relative flex flex-col lg:text-left text-center">
                <h1 className="lg:text-xl text-[16px] font-bold">
                  Do you want to update this notification?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you update this notification, it will be updated on
                  restaurant&apos;s system.
                </p>
              </ModalBody>

              <ModalFooter className="flex lg:justify-end justify-center items-center">
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black text-white"
                  onPress={onClose}
                >
                  Cancel
                </Button>

                {isLoading ? (
                  <>
                    <Button
                      isLoading
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      onPress={handleClick}
                      className="dark:bg-white dark:text-black text-white"
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

export default ModalConfirmUpdateNotification;
