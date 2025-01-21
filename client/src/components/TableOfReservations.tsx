"use client";
import ModalConfirmDeleteReservation from "@/components/modal/ModalConfirmDeleteReservation";
import ModalViewReservationOfCustomer from "@/components/modal/ModalViewReservationOfCustomer";
import { useUserStore } from "@/store";
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
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckIcon, EditIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  success: "success",
  error: "danger",
  pending: "warning",
};

const columns = [
  { name: "ID", uid: "id" },
  { name: "DATE AND TIME", uid: "date_time" },
  { name: "NUMBERS OF GUESTS", uid: "guests_count" },
  { name: "STATUS", uid: "status" },
  { name: "TOTAL PRICE", uid: "total_price" },
  { name: "PAYMENT STATUS", uid: "is_paid" },
  { name: "METHOD", uid: "payment_method" },
  { name: "OPTIONS", uid: "options" },
];

interface TableOfReservationsProps {
  reservations: Reservation[];
}

const methodMap = {
  card: "Credit Card",
  cash: "Pay In Card",
};

const TableOfReservations: React.FC<TableOfReservationsProps> = ({
  reservations,
}) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;
  const router = useRouter();

  const { user } = useUserStore();
  const query = useQueryClient();

  const totalPages = useMemo(() => {
    return Math.ceil((reservations?.length ?? 0) / itemsPerPage) ?? 0;
  }, [reservations]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return reservations?.slice(start, end) ?? [];
  }, [reservations, page]);

  const renderCell = useCallback(
    (reservation: Reservation, columnKey: React.Key) => {
      const cellValue = reservation[columnKey as keyof Reservation];

      switch (columnKey) {
        case "date_time": {
          return (
            <p>
              {format(
                (reservation.date_time as Date).toLocaleString(),
                "dd/MM/yyyy HH:mm"
              )}
            </p>
          );
        }

        case "guests_count": {
          return <p>{cellValue + " Guests"}</p>;
        }

        case "id": {
          return <p>#{cellValue as string}</p>;
        }

        case "is_paid": {
          return cellValue === true ? (
            <Chip
              color="success"
              isDisabled
              startContent={<CheckIcon />}
              variant="faded"
            >
              Paid
            </Chip>
          ) : (
            <Chip color="danger" startContent={<XIcon />} variant="faded">
              Not Paid
            </Chip>
          );
        }
        case "total_price": {
          if (!(cellValue instanceof Date)) {
            return <p>{cellValue as number}$</p>;
          }
        }

        case "status": {
          if (!(cellValue instanceof Date)) {
            return (
              <Chip
                color={statusColorMap[cellValue as string]}
                size="sm"
                variant="dot"
                className="capitalize border-none gap-1 text-default-600"
              >
                {cellValue as string}
              </Chip>
            );
          }
        }
        case "payment_method": {
          if (!(cellValue instanceof Date)) {
            return (
              <p>
                {
                  methodMap[
                    reservation?.payment
                      ?.payment_method as keyof typeof methodMap
                  ]
                }
              </p>
            );
          }
        }
        case "options": {
          return (
            <div className="flex items-center justify-center gap-2">
              <ModalViewReservationOfCustomer reservation={reservation} />

              <Tooltip
                content="Edit"
                showArrow
                className="dark:text-white text-black"
              >
                <span
                  className="opacity-50 hover:opacity-100 ease-in-out duration-250 
                transition-opacity cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/home/admin/reservations/customer/${user?.id}/edit`
                    );
                    query.setQueryData(["reservation", user?.id], reservation);
                  }}
                >
                  <EditIcon />
                </span>
              </Tooltip>

              <ModalConfirmDeleteReservation
                id={reservation.id}
                userId={reservation.user.id}
              />
            </div>
          );
        }
        case "date": {
          return <p>{cellValue as string}</p>;
        }
        default: {
          return cellValue as string | boolean;
        }
      }
    },
    [router, user, query]
  );

  return (
    <>
      <Table aria-label="Customers List" isHeaderSticky>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={
                column.uid === "options" || column.uid === "status"
                  ? "center"
                  : "start"
              }
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={items}
          emptyContent="This customer does'nt have any reservations."
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {reservations.length !== 0 && (
        <div className="flex lg:justify-start lg:items-start justify-center items-center">
          <Pagination
            showControls
            isCompact
            showShadow
            total={totalPages}
            classNames={{
              cursor: "dark:bg-white dark:text-black",
            }}
            initialPage={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </>
  );
};

export default TableOfReservations;
