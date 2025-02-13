"use client";
import { DeleteReservationDto } from "@/api/reservation/utils/types";
import { useDeleteReservation } from "@/hooks/use-delete-reservation";
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
import { Trash2Icon, TrashIcon } from "lucide-react";
import React, { useState } from "react";

interface ModalConfirmDeleteReservationProps {
  id: string;
  userId: string;
}

const ModalConfirmDeleteReservation: React.FC<
  ModalConfirmDeleteReservationProps
> = ({ id, userId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate: mutateDeleteReservation } = useDeleteReservation(userId);

  const handleClick = () => {
    setIsLoading(true);

    const data: DeleteReservationDto = {
      reservationId: id,
      userId,
    };

    setTimeout(() => {
      mutateDeleteReservation(data);
      onClose();
      setIsLoading(false);
    }, 2500);
  };

  return (
    <>
      <Tooltip
        content="Delete"
        showArrow
        className="dark:text-white text-black"
      >
        <span
          className="opacity-60 hover:opacity-100 ease-in-out 
        duration-250 transition-opacity relative cursor-pointer"
          onClick={onOpen}
        >
          <TrashIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        placement="center"
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
        <ModalContent className="dark:text-white text-black relative">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Delete Reservation
              </ModalHeader>

              <ModalBody className="relative flex flex-col lg:text-left text-center">
                <h1 className="lg:text-xl text-[16px] font-bold">
                  Do you want to delete this reservation?
                </h1>

                <p className="lg:text-[15px] text-[14px] dark:text-white/80 text-black/80">
                  If you delete, this reservation will be deleted permanently
                  from restaurant&apos;s database.
                </p>
              </ModalBody>

              <ModalFooter
                className="flex lg:justify-end lg:items-end 
              justify-center items-center"
              >
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

export default ModalConfirmDeleteReservation;
