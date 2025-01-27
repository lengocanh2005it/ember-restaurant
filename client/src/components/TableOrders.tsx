"use client";
import { DeleteOrderOptionsDto } from "@/api/orders/utils/types";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import ModalDetailsHistoryOrder from "@/components/modal/ModalDetailsHistoryOrder";
import ModalMessageOrder from "@/components/modal/ModalMessageOrder";
import ModalReOrder from "@/components/modal/ModalReOrder";
import { statusOptions } from "@/config/constants";
import { useDeleteOrder } from "@/hooks/use-delete-order";
import { useUserStore } from "@/store";
import { Order } from "@/utils/types";
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { format } from "date-fns";
import { CheckCircleIcon, TrashIcon, XCircleIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const columns = [
  { name: "ORDER ID", uid: "id" },
  { name: "DATE TIME", uid: "createdAt", sortable: true },
  { name: "ORDER DETAILS", uid: "order" },
  { name: "TOTAL PRICE", uid: "total_price", sortable: true },
  { name: "PAYMENT STATUS", uid: "is_paid" },
  { name: "ORDER STATUS", uid: "status" },
  { name: "OPTIONS", uid: "others" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  success: "success",
  error: "danger",
  pending: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "order",
  "total_price",
  "status",
  "others",
  "createdAt",
  "is_paid",
  "id",
];

interface TableOrdersProps {
  arrays: Order[];
}

export const TableOrders: React.FC<TableOrdersProps> = ({ arrays }) => {
  const rowsPerPage = 4;
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "total_price",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);
  const { user } = useUserStore();

  const { mutate: mutateDeleteOrder } = useDeleteOrder(user?.id!);

  const handleClick = (order: Order) => {
    const payload: DeleteOrderOptionsDto = {
      orderId: order.id,
      modeOption: "hard",
      userId: user?.id!,
    };
    mutateDeleteOrder(payload);
  };

  useEffect(() => {
    if (arrays) {
      setOrders(arrays);
    }
  }, [arrays]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredOrders = filteredOrders.filter((order) =>
        Array.from(statusFilter).includes(order.status)
      );
    }

    return filteredOrders;
  }, [filterValue, statusFilter, hasSearchFilter, orders]);

  const pages = React.useMemo(() => {
    return Math.ceil((filteredItems.length ?? 0) / rowsPerPage);
  }, [filteredItems]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems?.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Order, b: Order) => {
      const { column, direction } = sortDescriptor;

      let cmp = 0;

      if (column === "createdAt") {
        const dateA = new Date(a[column]);
        const dateB = new Date(b[column]);
        cmp = dateA.getTime() - dateB.getTime();
      } else if (column === "total_price") {
        const priceA = a[column];
        const priceB = b[column];
        cmp = priceA - priceB;
      }

      return direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = (order: Order, columnKey: React.Key) => {
    const cellValue = order[columnKey as keyof Order];

    switch (columnKey) {
      case "createdAt": {
        return (
          <p>
            {format(order.createdAt.toLocaleString(), "dd/MM/yyyy HH:mm:yy")}
          </p>
        );
      }

      case "total_price": {
        return (
          <p>
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
                ).toFixed(2) + "$"
              : order.total_price + "$"}
          </p>
        );
      }

      case "id": {
        return <p>#{cellValue as string}</p>;
      }

      case "is_paid": {
        if (cellValue === false) {
          return (
            <Chip
              color="danger"
              startContent={<XCircleIcon />}
              isDisabled
              variant="flat"
            >
              Not paid
            </Chip>
          );
        }
        return (
          <Chip
            isDisabled
            color="success"
            startContent={<CheckCircleIcon />}
            variant="flat"
          >
            Paid
          </Chip>
        );
      }

      case "order":
        return (
          <h1 className="max-w-[400px] truncate">
            {order.order_details
              .map(
                (detail) => detail.product.name + " (" + detail.quantity + ")"
              )
              .join(", ")}
          </h1>
        );

      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[order.status]}
            size="sm"
            variant="dot"
          >
            {cellValue as string}
          </Chip>
        );
      case "others":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <ModalDetailsHistoryOrder order={order} />

            {order.admin_message && order.admin_message !== "" && (
              <>
                <ModalMessageOrder message={order.admin_message} />
              </>
            )}

            <Tooltip
              content="Delete"
              showArrow
              className="dark:text-white text-black"
            >
              <span
                onClick={() => {
                  handleClick(order);
                }}
              >
                <TrashIcon
                  className="opacity-50 hover:opacity-100 
                duration-250 ease-in-out transition-opacity cursor-pointer"
                />
              </span>
            </Tooltip>

            <ModalReOrder
              order={arrays.find((item: Order) => item.id === order.id)!}
            />
          </div>
        );
      default:
        return cellValue;
    }
  };

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            classNames={{
              base: "w-full sm:max-w-[30%]",
            }}
            className="lg:mx-0 mx-auto"
            placeholder="Search Order ID..."
            size="sm"
            startContent={
              <SearchIcon
                className="text-default-300 opacity-70 hover:opacity-100 ease-in-out duration-300
              transition-all"
              />
            }
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem
                    key={status.uid}
                    className="capitalize dark:text-white text-black"
                  >
                    {status.name.charAt(0).toUpperCase() +
                      status.name.substring(1)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Option
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem
                    key={column.uid}
                    className="capitalize dark:text-white text-black"
                  >
                    {column.name.charAt(0).toUpperCase() +
                      column.name.substring(1)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onSearchChange]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <>
      <Table
        aria-labelledby="table"
        aria-label="table"
        removeWrapper
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        className="overflow-x-auto overflow-y-hidden"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={
                column.uid === "others" || column.uid === "status"
                  ? "center"
                  : "start"
              }
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Empty Orders."} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="cursor-pointer">
                  {renderCell(item, columnKey) as string | number}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {orders.length !== 0 && (
        <div className="flex lg:justify-start justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            classNames={{
              cursor: "dark:bg-white dark:text-black",
            }}
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </>
  );
};
