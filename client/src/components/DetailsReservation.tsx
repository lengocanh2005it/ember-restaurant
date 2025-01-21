"use client";
import { DeleteReservationDto } from "@/api/reservation/utils/types";
import DetailsReservationPriceModal from "@/components/modal/DetailsReservationPriceModal";
import { useDeleteReservation } from "@/hooks/use-delete-reservation";
import { useUserStore } from "@/store";
import { statusMap, methodMap } from "@/utils/maps";
import { Reservation } from "@/utils/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [arrayData, setArrayData] = useState<ArrayData[]>([]);

  const { user } = useUserStore();

  const { mutate: mutateDeleteReservation } = useDeleteReservation(user?.id!);

  useEffect(() => {
    const dataToPush: ArrayData[] = [
      {
        value: format(
          (reservation.date_time as Date).toLocaleString(),
          "dd/MM/yyyy HH:mm"
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
      {
        value: reservation.discount
          ? reservation.discount.value + " %"
          : "Null",
        icon: <GiftIcon />,
        name: "Discount",
      },
      {
        value: reservation.total_price + "$",
        icon: <DollarSignIcon />,
        name: "Total Price",
      },
      {
        value: reservation.note ? reservation.note : "Null",
        icon: <NotebookIcon />,
        name: "Note",
      },
    ];

    setArrayData(dataToPush);
  }, [reservation]);

  const handleClick = (id: string) => {
    setIsLoading(true);
    const data: DeleteReservationDto = {
      reservationId: id,
      userId: user?.id!,
    };
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      mutateDeleteReservation(data);
    }, 2500);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="dark:bg-white/30 hover:dark:bg-white/60 bg-black/70 dark:text-black
         text-white w-fit"
      >
        <EyeIcon />
        See Details
      </Button>

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
                {arrayData.map((data) => (
                  <div
                    key={data.name}
                    className={`flex
                      ${
                        data.name === "Note"
                          ? "flex flex-col"
                          : "md:flex-row flex-col lg:items-center lg:justify-between"
                      } lg:gap-1`}
                  >
                    <div className="relative flex items-center gap-1">
                      {data.icon}

                      <span
                        className="text-[14px] text-black/70 dark:text-white/70 
                      font-medium"
                      >
                        {data.name}:
                      </span>
                    </div>

                    <span className="lg:text-base text-[15px] font-medium">
                      {data.value}
                    </span>
                  </div>
                ))}

                <div className="flex flex-col items-center gap-3 lg:justify-end">
                  <DetailsReservationPriceModal tables={reservation.tables} />
                </div>
              </ModalBody>

              <ModalFooter className="flex items-center justify-center md:justify-between gap-2">
                {isLoading ? (
                  <>
                    <Button isLoading color="danger" className="w-fit">
                      Please wait...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      color="danger"
                      onPress={() => handleClick(reservation.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}

                <Button
                  color="primary"
                  onPress={onClose}
                  className="dark:bg-white dark:text-black w-fit"
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
