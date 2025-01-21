"use client";
import { UpdateReservationDto } from "@/api/reservation/utils/types";
import { useUpdateReservation } from "@/hooks/use-update-reservation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { Dispatch, SetStateAction, useState } from "react";

interface ModalConfirmEditReservationProps {
  isComplete: boolean;
  setIsComplete: Dispatch<SetStateAction<boolean>>;
  updateReservationStatus: UpdateReservationDto;
}

const ModalConfirmEditReservation: React.FC<
  ModalConfirmEditReservationProps
> = ({ isComplete, setIsComplete, updateReservationStatus }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onOpenChange, onClose } = useDisclosure();

  const { mutate: mutateUpdateReservationStatus } = useUpdateReservation(
    updateReservationStatus.userId
  );

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      mutateUpdateReservationStatus(updateReservationStatus);
      onClose();
    }, 2500);
    setTimeout(() => {
      setIsComplete(false);
    }, 2700);
  };

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isComplete}
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
        <ModalContent
          className="dark:text-white text-black relative border
         dark:border-white/30 border-black/60"
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Edit Reservation
              </ModalHeader>

              <ModalBody className="relative">
                <div className="flex flex-col gap-2">
                  <h1 className="lg:text-base text-[14px]">
                    Do you want to change this reservation?
                  </h1>
                  <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/70">
                    If you change, this reservation will be updated in
                    restaurant&apos;s database.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  onPress={() => {
                    setTimeout(() => {
                      setIsComplete(false);
                    }, 1000);
                    onClose();
                  }}
                  color="primary"
                  className="dark:bg-white dark:text-black"
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
                      Update
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

export default ModalConfirmEditReservation;
