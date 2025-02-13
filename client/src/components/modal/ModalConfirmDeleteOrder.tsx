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
import { Trash2Icon } from "lucide-react";

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
      onClose();
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
        backdrop="opaque"
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Delete Order
              </ModalHeader>

              <ModalBody className="relative flex flex-col lg:text-left text-center">
                <h1 className="lg:text-xl text-[16px] font-bold">
                  Do you want to delete this order?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you delete, this order will be disappeared in
                  restaurant&apos;s database.
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

export default ModalConfirmDeleteOrder;
