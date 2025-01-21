"use client";
import { CreateReservationDto } from "@/api/reservation/utils/types";
import ModalShowPayments from "@/components/modal/ModalShowPayments";
import { useAddReservation } from "@/hooks/use-add-reservation";
import { useUserStore } from "@/store";
import { CachedReservationData } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

interface ModalConfirmPaymentReservationProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmPaymentReservation: React.FC<
  ModalConfirmPaymentReservationProps
> = ({ isOpen, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reservationData, setReservationData] =
    useState<CachedReservationData | null>(null);
  const query = useQueryClient();
  const { user } = useUserStore();

  const { mutate: mutateAddReservation } = useAddReservation(user?.id!);

  const cachedData = query.getQueryData([
    "reservationData",
    user?.id!,
  ]) as CachedReservationData;

  useEffect(() => {
    if (cachedData) {
      setReservationData(cachedData as CachedReservationData);
    }
  }, [cachedData]);

  const handleClickNoPayment = () => {
    setIsLoading(true);

    const {
      userId,
      date_time,
      guests_count,
      discountId,
      areaId,
      tableIds,
      payment_method,
      promotionCode,
    } = reservationData as CachedReservationData;

    const reservationCreate: CreateReservationDto = {
      userId,
      date_time,
      guests_count,
      discountId,
      areaId,
      tableIds,
      payment_method: payment_method as "cash" | "card",
      promotionCode,
    };

    setTimeout(() => {
      setIsLoading(false);
      mutateAddReservation(reservationCreate);
      setIsOpen(false);
    }, 2200);
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
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
