"use client";
import { EditIcon } from "@/components/icons/EditIcon";
import ModalConfirmDeleteOrder from "@/components/modal/ModalConfirmDeleteOrder";
import ModalViewOrdersOfCustomer from "@/components/modal/ModalViewOrdersOfCustomer";
import { Order, User } from "@/utils";
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
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  success: "success",
  error: "danger",
  pending: "warning",
};

const methodMap = {
  card: "Credit Card",
  cash: "Pay In Cash",
};

interface ListOrdersOfCustomerProps {
  orders: Order[];
}

const columns = [
  { name: "DATE TIME", uid: "createdAt" },
  { name: "ORDER ID", uid: "id" },
  { name: "ORDER DETAILS", uid: "order" },
  { name: "TOTAL PRICE", uid: "total_price" },
  { name: "ORDER STATUS", uid: "status" },
  { name: "PAYMENT METHOD", uid: "method" },
  { name: "PAYMENT STATUS", uid: "is_paid" },
  { name: "OPTIONS", uid: "options" },
];

const ListOrdersOfCustomer: React.FC<ListOrdersOfCustomerProps> = ({
  orders,
}) => {
  const query = useQueryClient();
  const params = useParams();
  const [page, setPage] = useState<number>(1);
  const [customer, setCustomer] = useState<User | null>(null);
  const router = useRouter();

  const itemsPerPage = 3;

  const totalPages = useMemo(() => {
    return Math.ceil((orders?.length ?? 0) / itemsPerPage) ?? 0;
  }, [orders]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return orders?.slice(start, end) ?? [];
  }, [page, orders]);

  const cachedCustomerData = query.getQueryData(["customer"]) as User;

  useEffect(() => {
    if (cachedCustomerData) {
      setCustomer(cachedCustomerData as User);
    }
  }, [cachedCustomerData]);

  const renderCell = useCallback(
    (order: Order, columnKey: React.Key) => {
      const cellValue = order[columnKey as keyof Order];

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

        case "total_price": {
          return <p>{cellValue as string}$ (USD)</p>;
        }

        case "id": {
          return <p>{"#" + order.id}</p>;
        }

        case "method": {
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
        case "options": {
          return (
            <div className="flex items-center gap-3 justify-end">
              <ModalViewOrdersOfCustomer order={order} />

              {!order.is_paid && (
                <Tooltip content="Edit" className="dark:text-white text-black">
                  <span
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      query.setQueryData(["orderId"], order.id);
                      router.push(
                        `/home/admin/orders/customer/${params.id}/edit`
                      );
                    }}
                  >
                    <EditIcon />
                  </span>
                </Tooltip>
              )}

              <ModalConfirmDeleteOrder orderId={order.id} />
            </div>
          );
        }
        case "order": {
          return (
            <p className="truncate max-w-[450px] break-words">
              {order.order_details
                .map(
                  (detail) => detail.product.name + " (" + detail.quantity + ")"
                )
                .join(", ")}
            </p>
          );
        }
        case "status": {
          return (
            <Chip
              className="capitalize border-none"
              color={statusColorMap[order.status]}
              size="sm"
              variant="dot"
            >
              {cellValue as string}
            </Chip>
          );
        }
        case "is_paid": {
          return (
            <Chip
              color={order.is_paid === true ? "success" : "danger"}
              variant="flat"
              startContent={
                order.is_paid === true ? <CheckCircleIcon /> : <XCircleIcon />
              }
            >
              {order.is_paid === true ? "Paid" : "Not Paid"}
            </Chip>
          );
        }
        default:
          return cellValue;
      }
    },
    [router, params.id, query]
  );

  return (
    <main className="w-full container mx-auto px-4 py-6 flex flex-col gap-4">
      <div
        className="flex lg:flex-row flex-col lg:items-center lg:gap-3 gap-1 lg:px-10 px-0
      lg:justify-start justify-center items-center lg:text-left text-center"
      >
        <div
          className="relative w-[60px] h-[60px] rounded-full flex lg:items-start lg:justify-start
        items-center justify-center"
        >
          {customer?.image && customer.image && (
            <Image
              src={customer.image}
              alt="avatar"
              priority
              sizes="(max-width: 600px) 100vw, 50vw"
              fill
              className="cursor-pointer select-none object-cover rounded-full"
            />
          )}
        </div>

        {customer && (
          <div className="flex flex-col relative">
            <p>{customer.name ? customer.name : customer.username}</p>

            <p>Username: {customer.username ? customer.username : "Null"}</p>
          </div>
        )}
      </div>

      <Table aria-label="Table orders of customer">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "options" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
          emptyContent="This customer don't have any orders at the restaurant."
        >
          {(order) => (
            <TableRow key={order.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(order, columnKey) as string | number | boolean}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {orders.length !== 0 && (
        <div className="relative flex lg:justify-start lg:items-start justify-center items-center">
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
        </div>
      )}
    </main>
  );
};

export default ListOrdersOfCustomer;
