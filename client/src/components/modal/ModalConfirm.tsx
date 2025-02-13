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
        size="lg"
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

              <ModalBody className="relative flex flex-col lg:text-left text-center">
                <h1 className="lg:text-xl text-[16px] font-bold">
                  Are you sure you want to delete this dish?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you confirm the deletion, that dish will be permanently
                  removed from the restaurant&apos;s menu.
                </p>
              </ModalBody>

              <ModalFooter>
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

export default ModalConfirm;
