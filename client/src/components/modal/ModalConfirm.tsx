"use client";
import React, { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { TrashIcon } from "lucide-react";
import { useDeleteProduct } from "@/hooks/use-delete-product";

interface ModalConfirmProps {
  id: string;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ id }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutate: mutateDeleteProduct } = useDeleteProduct();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateDeleteProduct(id);
    }, 2500);
  };

  return (
    <>
      <TrashIcon
        className="cursor-pointer opacity-80 hover:opacity-100 
                      duration-250 ease-in-out transition-opacity"
        onClick={onOpen}
      />

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
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
                Confirm Delete
              </ModalHeader>

              <ModalBody>
                <div className="flex-col gap-3 rounded-md flex">
                  <h1 className="lg:text-base text-[14px] font-bold">
                    Are you sure you want to delete this dish?
                  </h1>

                  <p className="lg:text-[14px] text-[12px] dark:text-white/70 text-black/70">
                    If you confirm the deletion, that dish will be permanently
                    removed from the restaurant&apos;s menu.
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
                    <Button
                      isLoading
                      color="primary"
                      className="dark:bg-white dark:text-black"
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="danger"
                      onClick={() => {
                        handleClick();
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

export default ModalConfirm;
