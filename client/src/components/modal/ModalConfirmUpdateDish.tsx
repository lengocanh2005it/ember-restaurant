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
import { useUpdateProduct } from "@/hooks/use-update-product";
import { UpdateProductDto } from "@/api/products/utils/types";

interface ModalConfirmUpdateDishProps {
  productUpdate: UpdateProductDto;
  onCloseParent: () => void;
}

const ModalConfirmUpdateDish: React.FC<ModalConfirmUpdateDishProps> = ({
  productUpdate,
  onCloseParent,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate: mutateUpdateProduct } = useUpdateProduct();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      mutateUpdateProduct(productUpdate);
      setIsLoading(false);
      onClose();
      onCloseParent();
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
        size="xl"
        isDismissable
        isKeyboardDismissDisabled
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
              <ModalHeader className="flex flex-col gap-1">
                Confirm Update
              </ModalHeader>

              <ModalBody className="flex flex-col gap-2 relative">
                <h1 className="lg:text-base text-[14px] font-bold">
                  Are you sure you want to change the dish information?
                </h1>

                <p
                  className="lg:text-[14px] text-[12px]
                 dark:text-white/70 text-black/70"
                >
                  After the changes, the dish information in the restaurant will
                  be updated on the menu.
                </p>
              </ModalBody>

              <ModalFooter className="flex items-center justify-end gap-3">
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
                      isLoading
                      className="dark:bg-white dark:text-black"
                      color="primary"
                    >
                      Loading...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      className="dark:bg-white dark:text-black"
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

export default ModalConfirmUpdateDish;
