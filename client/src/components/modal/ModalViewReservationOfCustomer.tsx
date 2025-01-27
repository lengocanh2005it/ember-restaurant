"use client";
import ModalViewFeedbackReservations from "@/components/modal/ModalViewFeedbackReservations";
import { statusMap, methodMap, typeMap } from "@/utils/maps";
import { Reservation } from "@/utils/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
  Accordion,
  AccordionItem,
  Chip,
} from "@heroui/react";
import { format } from "date-fns";
import { EyeIcon } from "lucide-react";
import React from "react";

interface ModalViewReservationOfCustomerProps {
  reservation: Reservation;
}

const ModalViewReservationOfCustomer: React.FC<
  ModalViewReservationOfCustomerProps
> = ({ reservation }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const details = [
    {
      key: 1,
      title: "Date And Time",
      value: format(
        (reservation.date_time as Date).toLocaleString(),
        "yyyy-MM-dd HH:mm"
      ),
    },

    {
      key: 4,
      title: "Number Of Guests",
      value: reservation.guests_count + " Guests",
    },
    {
      key: 6,
      title: "Area",
      value: reservation?.tables[0]?.area?.name,
    },
    {
      key: 3,
      value: (
        <Accordion>
          <AccordionItem
            key={1}
            aria-label="tables"
            startContent={
              <h1 className="lg:text-[15[px] text-[14px] dark:text-white/70 text-black/70">
                Tables Details
              </h1>
            }
          >
            <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full">
              {reservation.tables.map((table) => (
                <Chip key={table.id}>
                  {table.name +
                    " (" +
                    typeMap[table.type as keyof typeof typeMap] +
                    ")"}
                </Chip>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      key: 5,
      title: "Status",
      value: statusMap[reservation.status as keyof typeof statusMap],
    },
    ...(reservation.discount
      ? [
          {
            key: 8,
            title: "Discount",
            value:
              reservation.discount.value +
              (reservation.discount.type === "percentage" ? " %" : " USD"),
          },
        ]
      : []),
    {
      key: 9,
      title: "Payment Method",
      value:
        methodMap[
          reservation?.payment?.payment_method as keyof typeof methodMap
        ],
    },
    {
      key: 2,
      title: "Payment Status",
      value: reservation.is_paid ? "Paid" : "Not Paid",
    },
    { key: 7, title: "Total Price", value: reservation.total_price + "$" },
    ...(reservation.note
      ? [{ key: 8, title: "Note", value: reservation.note }]
      : []),
  ];

  return (
    <>
      <Tooltip content="View" showArrow className="dark:text-white text-black">
        <span
          className="opacity-50 cursor-pointer hover:opacity-100 duration-250
         ease-in-out transition-opacity"
          onClick={onOpen}
        >
          <EyeIcon />
        </span>
      </Tooltip>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        size="xl"
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
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Reservation Details
              </ModalHeader>

              <ModalBody>
                {details.map((detail) => (
                  <div
                    key={detail.key}
                    className={`flex ${
                      detail.key !== 3 ? "sm:justify-between" : ""
                    } ${
                      detail.key === 8
                        ? "sm:flex-col sm:items-start"
                        : "sm:flex-row sm:items-center"
                    } flex-col`}
                  >
                    <h1 className="lg:text-[15[px] text-[14px] dark:text-white/70 text-black/70">
                      {detail.title}
                    </h1>

                    {detail.key !== 3 ? <p>{detail.value}</p> : detail.value}
                  </div>
                ))}
              </ModalBody>

              <ModalFooter
                className="flex md:flex-row flex-col
               items-center justify-between lg:gap-2 gap-4"
              >
                <ModalViewFeedbackReservations reviews={reservation.reviews} />

                <Button
                  color="primary"
                  className="dark:bg-white dark:text-black"
                  onPress={onClose}
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

export default ModalViewReservationOfCustomer;
