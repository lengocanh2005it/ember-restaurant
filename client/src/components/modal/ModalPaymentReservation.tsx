"use client";
import ModalBank from "@/components/modal/ModalBank";
import { useReservationStore } from "@/store";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import React from "react";

const methodMap = {
  cash: "Pay In Cash",
  card: "Credit Card",
};

const ModalPaymentReservation: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { reservationUpdate } = useReservationStore();

  const array = [
    {
      id: 1,
      name: "Date And Time",
      value: format(
        new Date(
          reservationUpdate?.date_time
            ? reservationUpdate.date_time
            : new Date()
        ),
        "dd/MM/yyyy HH:mm"
      ),
    },
    {
      id: 2,
      name: "Number Of Guests",
      value: reservationUpdate?.guests_count + " Guests",
    },
    {
      id: 4,
      name: "Number Of Tables",
      value: reservationUpdate?.tables?.length + " Tables",
    },
    {
      id: 5,
      name: "Payment Method",
      value:
        methodMap[
          reservationUpdate?.payment?.payment_method as keyof typeof methodMap
        ],
    },
    {
      id: 3,
      name: "Total Price",
      value: reservationUpdate?.total_price + "$",
    },
  ];

  return (
    <>
      <Chip
        variant="faded"
        color="danger"
        className="cursor-pointer opacity-60 hover:opacity-100 
        ease-in-out duration-250 transition-opacity"
        startContent={<XIcon />}
        onClick={onOpen}
      >
        Not Paid
      </Chip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
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
                  <Card key={data.id}>
                    <CardBody
                      className="flex md:flex-row flex-col 
                    gap-1 md:items-center md:justify-between"
                    >
                      <p
                        className="lg:text-[14px] text-[13px]
                       dark:text-white/70 text-black/80"
                      >
                        {data.name}
                      </p>

                      <h1 className="lg:text-base text-[14px] font-bold">
                        {data.value}
                      </h1>
                    </CardBody>
                  </Card>
                ))}

                {reservationUpdate?.payment?.payment_method === "card" ? (
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
