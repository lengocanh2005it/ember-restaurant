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
import { Trash2Icon, TrashIcon } from "lucide-react";
import { useUserStore } from "@/store";
import { useDeleteSupportTicket } from "@/hooks/use-delete-support-ticket";
import { DeleteSupportTicketDto } from "@/api/support-ticket/utils/types";

interface ModalConfirmDeleteRequestProps {
  requestId: string;
}

const ModalConfirmDeleteRequest: React.FC<ModalConfirmDeleteRequestProps> = ({
  requestId,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { user } = useUserStore();
  const { mutate: mutateDeleteSupportTicket } = useDeleteSupportTicket(
    user?.id!
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      const data: DeleteSupportTicketDto = {
        userId: user?.id!,
        requestId,
      };

      mutateDeleteSupportTicket(data);

      setIsLoading(true);
      onClose();
    }, 2500);
  };

  return (
    <>
      <Tooltip content="Delete" className="dark:bg-white text-black">
        <TrashIcon
          className="cursor-pointer opacity-60 hover:opacity-100 duration-250 ease-in-out
              transition-opacity"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        placement="center"
        size="lg"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isOpen}
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Delete Request Confirm
              </ModalHeader>

              <ModalBody className="relative flex flex-col lg:text-left text-center">
                <h1 className="lg:text-xl text-[16px] font-bold">
                  Do you want to delete this request?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you click &apos;Delete&apos;, this request will be
                  permanently deleted and cannot be restored.
                </p>
              </ModalBody>

              <ModalFooter className="flex lg:items-end lg:justify-end justify-center items-center">
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
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                      isLoading
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="danger"
                      onPress={handleClick}
                      startContent={<Trash2Icon />}
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

export default ModalConfirmDeleteRequest;
