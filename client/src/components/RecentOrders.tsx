"use client";
import { useOrder } from "@/hooks/use-orders-of-user";
import { useUserStore } from "@/store";
import { methodMap, statusColorMap, statusMap } from "@/utils/maps";
import { Order } from "@/utils/types";
import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@heroui/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const columns = [
  {
    key: "date",
    label: "DATE",
  },
  {
    key: "order",
    label: "ORDER DETAILS",
  },
  {
    key: "payment_status",
    label: "PAYMENT STATUS",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "discounts",
    label: "DISCOUNT",
  },
  {
    key: "price",
    label: "TOTAL PRICE",
  },
  {
    key: "payment_method",
    label: "PAYMENT METHOD",
  },
];

const RecentOrders: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const { user } = useUserStore();

  const { data, isLoading } = useOrder(user?.id!);

  const [page, setPage] = React.useState<number>(1);

  const rowsPerPage: number = 4;

  useEffect(() => {
    if (data && data.historyOrders) {
      const { historyOrders } = data;

      const arrayRecentOrders: Order[] = historyOrders.map((order: Order) => ({
        id: order.id,
        date: format(order.createdAt.toLocaleString(), "dd/MM/yyyy"),
        order: order.order_details
          .map((detail) => detail.product.name + " (" + detail.quantity + ")")
          .join(", "),
        payment_status: order.is_paid ? (
          <Chip color="success" variant="dot" className="cursor-pointer">
            Paid
          </Chip>
        ) : (
          <Chip color="danger" variant="dot" className="cursor-pointer">
            Not Paid
          </Chip>
        ),
        status: (
          <Chip
            color={statusColorMap[order.status as keyof typeof statusColorMap]}
            variant="dot"
            className="border-none"
          >
            {statusMap[order.status as keyof typeof statusMap]}
          </Chip>
        ),
        payment_method:
          methodMap[order?.payment?.payment_method as keyof typeof methodMap],
        price:
          order.discounts && order.discounts.length !== 0
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
            : order.total_price + "$",
        discounts:
          order.discounts && order.discounts.length > 0
            ? order.discounts.map((discount) => discount.value + "%").join(",")
            : "Null",
      }));

      setRecentOrders(arrayRecentOrders as Order[]);
    }
  }, [data]);

  const pages = React.useMemo(() => {
    return Math.ceil((recentOrders.length ?? 0) / rowsPerPage);
  }, [recentOrders]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return recentOrders?.slice(start, end);
  }, [page, recentOrders]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {recentOrders.length !== 0 ? (
        <>
          <Table
            isHeaderSticky
            isStriped
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  align={column.key === "status" ? "center" : "start"}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell className="max-w-[300px] truncate">
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex lg:items-start lg:justify-start items-center justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              classNames={{
                cursor: "bg-foreground text-background",
              }}
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        </>
      ) : (
        <>
          <h1
            className="lg:px-4 px-2 dark:text-white/60 text-black/60 
            lg:text-[14px] text-[13px] lg:text-left text-center"
          >
            You don&apos;t have any orders!
          </h1>
        </>
      )}
    </>
  );
};

export default RecentOrders;
