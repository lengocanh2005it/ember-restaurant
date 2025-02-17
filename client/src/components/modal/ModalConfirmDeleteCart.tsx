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
import { useDeleteCart } from "@/hooks/use-delete-cart";
import { useCartStore, useUserStore } from "@/store";

interface ModalConfirmDeleteCartProps {
  cartId: string;
}

const ModalConfirmDeleteCart: React.FC<ModalConfirmDeleteCartProps> = ({
  cartId,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const { setSelectedCarts, selectedCarts } = useCartStore();

  const { mutate: mutateDeleteCart } = useDeleteCart(user?.id!);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      mutateDeleteCart({
        userId: user?.id!,
        cartId,
      });
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
          size={30}
          className="opacity-60 hover:opacity-100"
          onClick={() => {
            onOpen();
            setSelectedCarts(
              selectedCarts.filter((cart) => cart.id !== cartId)
            );
          }}
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
                Delete Cart Confirm
              </ModalHeader>

              <ModalBody className="relative flex flex-col lg:text-left text-center">
                <h1 className="lg:text-xl text-[16px] font-bold">
                  Do you want to delete this cart?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you click &apos;Delete&apos;, this cart will be permanently
                  deleted and cannot be restored.
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

export default ModalConfirmDeleteCart;
