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
} from "@nextui-org/react";
import { TrashIcon } from "lucide-react";
import { useDeletePromotion } from "@/hooks/use-delete-promotion";

interface ModalConfirmDeletePromotionProps {
  promotionId: string;
}

const ModalConfirmDeletePromotion: React.FC<
  ModalConfirmDeletePromotionProps
> = ({ promotionId }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: mutateDeletePromotion } = useDeletePromotion();

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateDeletePromotion(promotionId);
      onClose();
    }, 2500);
  };

  return (
    <>
      <Tooltip content="Delete" showArrow className="dark:bg-white text-black">
        <TrashIcon
          className="opacity-50 hover:opacity-100 
                duration-250 ease-in-out transition-opacity cursor-pointer select-none"
          onClick={onOpen}
        />
      </Tooltip>

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
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
              <ModalHeader className="flex flex-col gap-1">
                Confirmation
              </ModalHeader>

              <ModalBody>
                <h1 className="lg:text-base text-[14px] font-bold">
                  Do you want to delete this promotions?
                </h1>

                <p className="lg:text-[14px] text-[12px] dark:text-white/50 text-black/50">
                  If you click &quot;Yes&quot;, this promotion will be deleted
                  permanently in system&apos;database.
                </p>
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
                      color="primary"
                      className="dark:bg-white dark:text-black"
                      isLoading
                    >
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="primary"
                      className="dark:bg-white dark:text-black text-white"
                      onPress={handleClick}
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

export default ModalConfirmDeletePromotion;
