import { EyeIcon } from "@/components/icons/EyeIcon";
import { Notification } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { format } from "date-fns";
import React from "react";

interface ModalViewNotificationProps {
  notification: Notification;
}

const ModalViewNotification: React.FC<ModalViewNotificationProps> = ({
  notification,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip content="View" className="dark:text-white text-black">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="opaque"
        placement="center"
        size="lg"
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Notification Details
              </ModalHeader>

              <ModalBody>
                <div
                  className="flex lg:flex-row flex-col lg:items-center 
                  lg:justify-between p-1 px-3 border dark:border-white/20 border-black/20
                  rounded-lg"
                >
                  <h1 className="dark:text-white/80 text-black/80">Date</h1>

                  <p>
                    {format(
                      notification?.createdAt
                        ? notification.createdAt
                        : new Date(),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </div>

                <div
                  className="flex flex-col p-1 px-3 border dark:border-white/20 border-black/20
                  rounded-lg"
                >
                  <h1 className="dark:text-white/80 text-black/80">Title</h1>

                  <p className="truncate max-w-[400px]">{notification.title}</p>
                </div>

                <div
                  className="flex flex-col p-1 px-3 border dark:border-white/20 border-black/20
                  rounded-lg"
                >
                  <h1 className="dark:text-white/80 text-black/80">Content</h1>

                  <p className="truncate max-w-[500px] break-words">
                    {notification.content}
                  </p>
                </div>

                <div
                  className="flex lg:flex-row flex-col lg:items-center 
                  lg:justify-between p-1 px-3 border dark:border-white/20 border-black/20
                  rounded-lg"
                >
                  <h1 className="dark:text-white/80 text-black/80">
                    Number Views
                  </h1>

                  <p className="flex items-center gap-2">
                    <EyeIcon />
                    {notification.number}
                  </p>
                </div>

                <div
                  className="flex flex-col p-1 px-3 border dark:border-white/20 border-black/20
                  rounded-lg"
                >
                  <h1 className="dark:text-white/80 text-black/80">
                    Image URL
                  </h1>

                  <p className="break-words lg:text-[14px] text-[13px]">
                    {notification.image}
                  </p>
                </div>
              </ModalBody>

              <ModalFooter
                className="relative flex lg:justify-end lg:items-end 
              justify-center items-center"
              >
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
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

export default ModalViewNotification;
