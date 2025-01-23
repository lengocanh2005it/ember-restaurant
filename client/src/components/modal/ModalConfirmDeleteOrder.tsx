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
import { useDeleteOrder } from "@/hooks/use-delete-order";
import { DeleteOrderOptionsDto } from "@/api/orders/utils/types";
import { useUserStore } from "@/store";

interface ModalConfirmDeleteOrderProps {
  orderId: string;
}

const ModalConfirmDeleteOrder: React.FC<ModalConfirmDeleteOrderProps> = ({
  orderId,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();

  const { mutate: mutateDeleteOrder } = useDeleteOrder(user?.id!);

  const handleClick = () => {
    setIsLoading(true);
    const data: DeleteOrderOptionsDto = {
      orderId,
      modeOption: "hard",
      userId: user?.id!,
    };

    setTimeout(() => {
      setIsLoading(false);
      onClose;
      mutateDeleteOrder(data);
    }, 2500);
  };

  return (
    <>
      <Tooltip
        color="danger"
        content="Delete"
        className="dark:text-white text-black"
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
        placement="center"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        size="lg"
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
                Delete Order
              </ModalHeader>

              <ModalBody>
                <div className="flex flex-col gap-2">
                  <h1 className="lg:text-xl text-[16px]">
                    Do you want to delete this order?
                  </h1>

                  <p className="lg:text-[14px] text-[12px] dark:text-gray-300 text-black/60">
                    If you delete, this order will be disappeared in
                    restaurant&apos;s database.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
                  onPress={onClose}
                >
                  Cancel
                </Button>

                {isLoading ? (
                  <>
                    <Button isLoading className="dark:bg-white dark:text-black">
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button color="danger" onPress={handleClick}>
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

export default ModalConfirmDeleteOrder;
