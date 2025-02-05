"use client";
import ModalMessageOrder from "@/components/modal/ModalMessageOrder";
import ModalOrderDetails from "@/components/modal/ModalOrderDetails";
import ModalPayment from "@/components/modal/ModalPayment";
import { useOrderStore, useUserStore } from "@/store";
import { Order } from "@/utils/types";
import {
  Chip,
  ChipProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircleIcon } from "lucide-react";
import React from "react";

const columns = [
  { name: "ORDER ID", uid: "id" },
  { name: "DATE TIME", uid: "createdAt" },
  { name: "ORDER DETAILS", uid: "order_details" },
  { name: "PAYMENT METHOD", uid: "payment?.payment_method" },
  { name: "PAYMENT STATUS", uid: "is_paid" },
  { name: "ORDER STATUS", uid: "status" },
  { name: "TOTAL PRICE", uid: "total_price" },
  { name: "OPTIONS", uid: "options" },
];

interface CurrentOrdersTableProps {
  orders: Order[];
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  success: "success",
  pending: "warning",
  error: "danger",
};

const methodMap = {
  cash: "Pay In Cash",
  card: "Credit Card",
};

const CurrentOrdersTable: React.FC<CurrentOrdersTableProps> = ({ orders }) => {
  const { setOrderUpdate } = useOrderStore();
  const { user } = useUserStore();
  const query = useQueryClient();

  const renderCell = React.useCallback(
    (order: Order, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof typeof order];

      switch (columnKey) {
        case "createdAt": {
          return (
            <p>
              {format(
                order?.createdAt ? order.createdAt : new Date(),
                "dd/MM/yyyy HH:mm:yy"
              )}
            </p>
          );
        }
        case "id": {
          return <p>#{cellValue as string}</p>;
        }
        case "order_details": {
          return (
            <p className="max-w-full truncate break-words">
              {order.order_details
                .map(
                  (detail) => detail.product.name + " (" + detail.quantity + ")"
                )
                .join(", ")}
            </p>
          );
        }
        case "payment?.payment_method": {
          return (
            <p>
              {
                methodMap[
                  order?.payment?.payment_method as keyof typeof methodMap
                ]
              }
            </p>
          );
        }
        case "is_paid": {
          return order.is_paid ? (
            <Chip
              color="success"
              variant="flat"
              startContent={<CheckCircleIcon />}
              isDisabled
            >
              Paid
            </Chip>
          ) : (
            <div
              onClick={() => {
                query.removeQueries({
                  queryKey: ["reservationData", user?.id!],
                });
              }}
            >
              <ModalPayment order={order} />
            </div>
          );
        }
        case "status": {
          return (
            <Chip
              color={statusColorMap[order.status]}
              size="sm"
              variant="dot"
              className="text-default-600 border-none gap-1"
            >
              {order.status.charAt(0).toUpperCase() + order.status.substring(1)}
            </Chip>
          );
        }
        case "total_price": {
          return <p>{order.total_price}$</p>;
        }
        case "options": {
          return (
            <div className="flex items-center">
              <span
                onClick={() => {
                  setOrderUpdate({
                    ...order,
                    total_price: order.total_price,
                  });
                }}
              >
                <ModalOrderDetails order={order} />
              </span>

              {order.admin_message && order.admin_message !== "" && (
                <ModalMessageOrder message={order.admin_message} />
              )}
            </div>
          );
        }
        default:
          return cellValue as string | number;
      }
    },
    [query, setOrderUpdate, user]
  );

  return (
    <Table aria-label="Current Orders Table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={orders} emptyContent="Empty Orders.">
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CurrentOrdersTable;
