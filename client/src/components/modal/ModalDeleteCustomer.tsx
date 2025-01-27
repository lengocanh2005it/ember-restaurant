"use client";
import React, { useState } from "react";
import { useDeleteCustomer } from "@/hooks/use-delete-user";
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

interface ModalDeleteCustomerProps {
  userId: string;
}

const ModalDeleteCustomer: React.FC<ModalDeleteCustomerProps> = ({
  userId,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateDeleteCustomer } = useDeleteCustomer();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateDeleteCustomer(userId);
    }, 2500);
  };

  return (
    <>
      <Tooltip color="danger" content="Delete customer">
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Confirm Delete
              </ModalHeader>

              <ModalBody className="flex flex-col gap-2">
                <h1 className="lg:text-xl text-base">
                  Are you sure you want to delete this customer?
                </h1>

                <p className="lg:text-[14px] text-[12px] dark:text-white/50 text-black/60">
                  If you delete the customer, their information will be
                  permanently removed from the restaurant&apos;s database.
                </p>
              </ModalBody>

              <ModalFooter
                className="relative flex lg:items-end lg:justify-end
               items-center justify-center"
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
                    <Button isLoading color="danger">
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button color="danger" onPress={handleClick}>
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

export default ModalDeleteCustomer;
