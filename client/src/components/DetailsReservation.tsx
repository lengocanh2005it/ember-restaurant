"use client";
import DetailsReservationPriceModal from "@/components/modal/DetailsReservationPriceModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/store";
import { methodMap, statusMap } from "@/utils/maps";
import { Reservation } from "@/utils/types";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { format } from "date-fns";
import {
  BarChartIcon,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  EyeIcon,
  GiftIcon,
  NotebookIcon,
  TableIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { v4 } from "uuid";

type ArrayData = {
  name: string;
  value: string | number;
  icon: ReactNode;
};

interface DetailsReservationProps {
  reservation: Reservation;
}

const DetailsReservation: React.FC<DetailsReservationProps> = ({
  reservation,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [arrayData, setArrayData] = useState<ArrayData[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const dataToPush: ArrayData[] = [
      {
        value: format(
          (reservation.date_time as Date).toLocaleString(),
          "EEEE, dd/MM/yyyy HH:mm"
        ),
        icon: <CalendarIcon />,
        name: "Date And Time",
      },
      {
        value: reservation.guests_count + " Guests",
        icon: <UsersIcon />,
        name: "Number Of Guests",
      },
      {
        value: reservation?.tables?.length + " Tables",
        icon: <TableIcon />,
        name: "Number Of Tables",
      },
      {
        value: statusMap[reservation.status as keyof typeof statusMap],
        icon: <BarChartIcon />,
        name: "Status",
      },
      {
        value:
          methodMap[
            reservation?.payment?.payment_method as keyof typeof methodMap
          ],
        icon: <TagIcon />,
        name: "Payment Method",
      },
      {
        value: reservation.is_paid === true ? "Paid" : "Not Paid",
        icon: <CreditCardIcon />,
        name: "Payment Status",
      },
      ...(reservation.discount
        ? [
            {
              value: reservation.discount
                ? reservation.discount.value + " %"
                : "Null",
              icon: <GiftIcon />,
              name: "Discount",
            },
          ]
        : []),
      {
        value: reservation.total_price + "$",
        icon: <DollarSignIcon />,
        name: "Total Price",
      },
      ...(reservation.note
        ? [
            {
              value: reservation.note ? reservation.note : "Null",
              icon: <NotebookIcon />,
              name: "Note",
            },
          ]
        : []),
    ];

    setArrayData(dataToPush);
  }, [reservation]);

  return (
    <>
      <Chip
        onClick={onOpen}
        color="primary"
        className="dark:bg-white dark:text-black opacity-70 hover:opacity-100
         text-white w-fit duration-300 ease-in-out transition-opacity cursor-pointer"
        startContent={<EyeIcon />}
      >
        See Details
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
        <ModalContent className="text-black dark:text-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 lg:text-left text-center">
                Reservation Details
              </ModalHeader>

              <ModalBody>
                <ScrollArea className="h-[400px] w-full pr-3">
                  <div className="flex flex-col gap-2">
                    {arrayData.map((data) => (
                      <div
                        key={data.name + new Date().getTime().toString() + v4()}
                        className={`flex
                          p-2 border dark:border-white/20 border-black/20 rounded-lg
                      ${
                        data.name === "Note" ||
                        data.name === "Payment Method" ||
                        data.name === "Date And Time"
                          ? "flex flex-col"
                          : "md:flex-row flex-col lg:items-center lg:justify-between"
                      } lg:gap-1`}
                      >
                        <div className="relative flex items-center gap-1">
                          {data.icon}

                          <span className="text-[14px] text-black/70 dark:text-white/70 font-medium">
                            {data.name}
                          </span>
                        </div>

                        <span className="lg:text-base text-[15px] font-normal">
                          {data.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div
                  className="flex flex-col items-center md:items-end gap-3 md:justify-end 
                justify-center"
                >
                  <DetailsReservationPriceModal
                    tables={reservation.tables}
                    key={
                      reservation.id + new Date().getTime().toString() + v4()
                    }
                  />
                </div>
              </ModalBody>

              <ModalFooter className="flex md:justify-end md:items-end items-center justify-center">
                <Button
                  color="primary"
                  onPress={onClose}
                  className="dark:bg-white dark:text-black text-white"
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

export default DetailsReservation;
