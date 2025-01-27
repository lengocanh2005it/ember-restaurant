"use client";
import { CreateReservationDto } from "@/api/reservation/utils/types";
import ModalShowPayments from "@/components/modal/ModalShowPayments";
import { useAddReservation } from "@/hooks/use-add-reservation";
import { useReservationStore, useUserStore } from "@/store";
import { CachedReservationData } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useState } from "react";

interface ModalConfirmPaymentReservationProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmPaymentReservation: React.FC<
  ModalConfirmPaymentReservationProps
> = ({ isOpen, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const { reservationData } = useReservationStore();

  const { mutate: mutateAddReservation } = useAddReservation(user?.id!);

  const handleClickNoPayment = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (reservationData) {
        mutateAddReservation(reservationData);
      }
      setIsOpen(false);
    }, 2200);
  };

  return (
    <Modal
      backdrop="opaque"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      placement="center"
      size="lg"
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
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <ModalContent className="dark:text-white text-black">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
              Credit Card Payment
            </ModalHeader>

            <ModalBody className="relative flex flex-col gap-2 items-center">
              <p className="lg:text-[14px] text-[13px] text-center">
                Would you like to pay for this reservation now? If yes, please
                click the Payment button below. If not, you can click the No
                Payment button. You can still make the payment later from the
                &quot;Reservation&quot; page.
              </p>

              <ModalShowPayments />
            </ModalBody>

            <ModalFooter className="flex lg:justify-end lg:items-end items-center justify-center">
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
                    className="dark:bg-white dark:text-black"
                    onPress={handleClickNoPayment}
                  >
                    No Payment
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalConfirmPaymentReservation;
