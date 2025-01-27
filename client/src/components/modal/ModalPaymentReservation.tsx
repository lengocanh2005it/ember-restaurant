"use client";
import ModalBank from "@/components/modal/ModalBank";
import { useAppStore, useOrderStore, useReservationStore } from "@/store";
import { Reservation } from "@/utils";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { format } from "date-fns";
import { XCircleIcon } from "lucide-react";
import React from "react";

const methodMap = {
  cash: "Pay In Cash",
  card: "Credit Card",
};

interface ModalPaymentReservationProps {
  reservation: Reservation;
}

const ModalPaymentReservation: React.FC<ModalPaymentReservationProps> = ({
  reservation,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setReservationPayment, reservationPayment, setReservationData } =
    useReservationStore();
  const { setType } = useAppStore();
  const { setOrderData, setOrderPayment, setOrderUpdate } = useOrderStore();

  const array = [
    {
      id: 1,
      name: "Date And Time",
      value: format(
        new Date(
          reservationPayment?.date_time
            ? reservationPayment.date_time
            : new Date()
        ),
        "EEEE, dd/MM/yyyy HH:mm"
      ),
    },
    {
      id: 2,
      name: "Number Of Guests",
      value: reservationPayment?.guests_count + " Guests",
    },
    {
      id: 4,
      name: "Number Of Tables",
      value: reservationPayment?.tables?.length + " Tables",
    },
    {
      id: 5,
      name: "Payment Method",
      value:
        methodMap[
          reservationPayment?.payment?.payment_method as keyof typeof methodMap
        ],
    },
    {
      id: 3,
      name: "Total Price",
      value: reservationPayment?.total_price + "$",
    },
  ];

  const handleClick = () => {
    onOpen();
    setReservationPayment(reservation);
    setType("reservation");
    setReservationData(null);
    setOrderData(null);
    setOrderPayment(null);
    setOrderUpdate(null);
  };

  return (
    <>
      <Tooltip content="Click to pay" className="dark:text-white text-black">
        <Chip
          variant="flat"
          color="danger"
          className="cursor-pointer opacity-60 hover:opacity-100 
        ease-in-out duration-250 transition-opacity"
          startContent={<XCircleIcon />}
          onClick={handleClick}
        >
          Not Paid
        </Chip>
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        onOpenChange={onOpenChange}
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
      >
        <ModalContent className="dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col lg:text-left text-center">
                Reservation Payment
              </ModalHeader>

              <ModalBody>
                {array.map((data) => (
                  <div
                    key={data.id}
                    className="flex md:flex-row flex-col 
                   gap-1 md:items-center md:justify-between p-2 rounded-lg border
                  dark:border-white/20 border-black/20"
                  >
                    <p
                      className="lg:text-[14px] text-[13px]
                      dark:text-white/70 text-black/80"
                    >
                      {data.name}
                    </p>

                    <h1 className="lg:text-base text-[14px] font-medium">
                      {data.value}
                    </h1>
                  </div>
                ))}

                {reservationPayment?.payment?.payment_method === "card" ? (
                  <div className="flex items-center justify-center">
                    <ModalBank />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1 flex-col text-center">
                      <Chip color="danger">Note</Chip>

                      <h1 className="text-[14px]">
                        You need to go to our restaurant to pay your
                        reservation.
                      </h1>
                    </div>
                  </>
                )}
              </ModalBody>

              <ModalFooter className="flex justify-center items-center">
                <Button
                  onPress={onClose}
                  className="dark:bg-white dark:text-black text-white"
                  color="primary"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalPaymentReservation;
