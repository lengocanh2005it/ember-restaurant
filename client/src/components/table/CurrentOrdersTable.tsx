"use client";
import { CheckIcon } from "@/components/icons/CheckIcon";
import ModalMessageOrder from "@/components/modal/ModalMessageOrder";
import ModalOrderDetails from "@/components/modal/ModalOrderDetails";
import ModalPayment from "@/components/modal/ModalPayment";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderStore, useUserStore } from "@/store";
import { Order } from "@/utils/types";
import { Chip, ChipProps } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";

const headers = [
  { id: 1, name: "ID" },
  { id: 2, name: "DATE" },
  { id: 3, name: "ORDER DETAILS" },
  { id: 9, name: "PAYMENT METHOD" },
  { id: 10, name: "PAYMENT STATUS" },
  { id: 11, name: "STATUS" },
  { id: 12, name: "TOTAL PRICE" },
  { id: 13, name: "OTHERS" },
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
  const { setOrderPayment, setOrderUpdate } = useOrderStore();
  const { user } = useUserStore();
  const query = useQueryClient();

  return (
    <Table aria-labelledby="table" aria-label="table">
      <TableCaption>
        {orders.length !== 0
          ? "A list of your current orders."
          : "Empty Orders."}
      </TableCaption>
      <TableHeader className="cursor-pointer">
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header.id}>{header.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="cursor-pointer">
            <TableCell>
              {order.createdAt
                ? format(order.createdAt.toLocaleString(), "dd/MM/yyyy")
                : "Null"}
            </TableCell>

            <TableCell>#{order.id ? order.id : "Null"}</TableCell>

            <TableCell className="max-w-[400px] break-words">
              {order.order_details
                .map(
                  (detail) => detail.product.name + " (" + detail.quantity + ")"
                )
                .join(", ")}
            </TableCell>

            <TableCell>
              {
                methodMap[
                  order?.payment?.payment_method as keyof typeof methodMap
                ]
              }
            </TableCell>

            <TableCell
              onClick={() => {
                setOrderPayment({
                  orderId: order.id,
                  totalPrice: order.total_price,
                });
              }}
            >
              {order.is_paid ? (
                <Chip
                  color="success"
                  variant="faded"
                  startContent={<CheckIcon size={18} />}
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
                  <ModalPayment
                    data={{
                      orderId: order.id,
                      paymentMethod:
                        methodMap[
                          order?.payment
                            ?.payment_method as keyof typeof methodMap
                        ],
                      totalPrice: order.total_price,
                      products: order.order_details
                        .map(
                          (detail) =>
                            detail.product.name + " (" + detail.quantity + ")"
                        )
                        .join(", "),
                    }}
                  />
                </div>
              )}
            </TableCell>

            <TableCell>
              <Chip
                color={statusColorMap[order.status]}
                size="sm"
                variant="dot"
                className="text-default-600 border-none gap-1"
              >
                {order.status.charAt(0).toUpperCase() +
                  order.status.substring(1)}
              </Chip>
            </TableCell>

            <TableCell className="max-w-[200px]">
              {order.discounts && order.discounts.length !== 0
                ? Number(
                    order.total_price -
                      (order.total_price *
                        order.discounts
                          .map((order) => order.value)
                          .reduce((acc, curr) => {
                            return acc + curr;
                          }, 0)) /
                        100
                  ).toFixed(2)
                : order.total_price}
              $
            </TableCell>

            <TableCell className="flex items-center gap-2">
              <span
                onClick={(e) => {
                  setOrderUpdate({
                    ...order,
                    total_price:
                      order.discounts && order.discounts.length !== 0
                        ? +Number(
                            order.total_price -
                              (order.total_price *
                                order.discounts
                                  .map((order) => order.value)
                                  .reduce((acc, curr) => {
                                    return acc + curr;
                                  }, 0)) /
                                100
                          ).toFixed(2)
                        : order.total_price,
                  });
                }}
              >
                <ModalOrderDetails order={order} />
              </span>

              {order.admin_message && order.admin_message !== "" && (
                <>
                  <ModalMessageOrder message={order.admin_message} />
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CurrentOrdersTable;
