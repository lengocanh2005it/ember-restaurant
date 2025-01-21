"use client";
import DetailsReservation from "@/components/DetailsReservation";
import { CheckIcon } from "@/components/icons/CheckIcon";
import ModalEditReservation from "@/components/modal/ModalEditReservation";
import ModalPaymentReservation from "@/components/modal/ModalPaymentReservation";
import ModalUpdateReservation from "@/components/modal/ModalUpdateReservation";
import { useDeleteReservation } from "@/hooks/use-delete-reservation";
import { useReservationStore, useUserStore } from "@/store";
import { statusMap } from "@/utils/maps";
import { Reservation } from "@/utils/types";
import {
  Chip,
  ChipProps,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import React from "react";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "date_time",
    label: "DATE AND TIME",
  },
  {
    key: "guests_count",
    label: "NUMBER OF GUESTS",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "is_paid",
    label: "PAYMENT STATUS",
  },
  {
    key: "total_price",
    label: "TOTAL PRICE",
  },
  {
    key: "details",
    label: "DETAILS",
  },
  {
    key: "options",
    label: "OPTIONS",
  },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  success: "success",
  error: "danger",
  pending: "warning",
};

interface ReservationListProps {
  reservations: Reservation[];
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => {
  const [page, setPage] = React.useState<number>(1);
  const { setReservationUpdate, setReservationPayment } = useReservationStore();
  const { user } = useUserStore();

  const rowsPerPage = 3;

  const totalPages = React.useMemo(() => {
    return Math.ceil((reservations.length ?? 0) / rowsPerPage);
  }, [reservations]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reservations.slice(start, end);
  }, [page, reservations]);

  const { mutate: mutateDeleteReservation } = useDeleteReservation(user?.id!);

  const renderCell = (reservation: Reservation, columnKey: React.Key) => {
    const cellValue = reservation[columnKey as keyof Reservation];

    switch (columnKey) {
      case "discount": {
        if (!(cellValue instanceof Date)) {
          if (cellValue) {
            return <p>{cellValue as number}%</p>;
          } else {
            return <p>0%</p>;
          }
        }
      }

      case "status": {
        return (
          <Chip
            color={statusColorMap[cellValue as string]}
            variant="dot"
            className="border-none"
          >
            {statusMap[cellValue as string as keyof typeof statusMap]}
          </Chip>
        );
      }

      case "date_time": {
        const formatDateTime = format(
          (cellValue as Date).toLocaleString(),
          "dd/MM/yyyy HH:mm"
        );

        return <p>{formatDateTime}</p>;
      }

      case "guests_count": {
        return (
          <div className="flex items-center gap-1">
            <p>{cellValue as number}</p>
            <p>guests</p>
          </div>
        );
      }

      case "id": {
        return <p>#{cellValue as string}</p>;
      }

      case "is_paid": {
        return cellValue ? (
          <Chip
            color="success"
            isDisabled
            startContent={<CheckIcon />}
            variant="faded"
          >
            Paid
          </Chip>
        ) : (
          <div
            onClick={() => {
              setReservationUpdate(reservation);
              setReservationPayment({
                reservationId: reservation.id,
                totalPrice: reservation.total_price,
              });
            }}
          >
            <ModalPaymentReservation />
          </div>
        );
      }
      case "details": {
        return <DetailsReservation reservation={reservation} />;
      }

      case "total_price": {
        if (!(cellValue instanceof Date)) {
          return <p>{cellValue as number}$</p>;
        }
      }
      case "options": {
        return (
          <div
            className={`flex ${
              !reservation.is_paid &&
              "flex-row-reverse justify-center items-center"
            } items-start justify-center gap-2`}
            onClick={() => {
              setReservationUpdate(reservation);
            }}
          >
            <Tooltip
              content="Delete"
              className="dark:text-white text-black"
              showArrow
            >
              <TrashIcon
                className="opacity-50 hover:opacity-100 ease-in-out
           cursor-pointer duration-250 transition-opacity"
                onClick={() => {
                  mutateDeleteReservation({
                    userId: user?.id!,
                    reservationId: reservation.id,
                  });
                }}
              />
            </Tooltip>

            {reservation.admin_message && (
              <ModalEditReservation message={reservation.admin_message} />
            )}

            {!reservation.is_paid && <ModalUpdateReservation />}
          </div>
        );
      }
      default: {
        if (cellValue instanceof Date) {
          const formattedDate = cellValue.toLocaleDateString("en-CA");
          return <p>{formattedDate}</p>;
        } else {
          return <p>{cellValue?.toString()}</p>;
        }
      }
    }
  };

  return (
    <>
      <Table
        aria-label="History Reservation List"
        isStriped
        isCompact
        isHeaderSticky
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={
                column.key === "options" ||
                column.key === "status" ||
                column.key === "details"
                  ? "center"
                  : "start"
              }
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={items}
          emptyContent={"You don't have any reservations!"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="max-w-[400px] truncate">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {items.length !== 0 && (
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          total={totalPages}
          page={page}
          onChange={(page) => setPage(page)}
        />
      )}
    </>
  );
};

export default ReservationList;
