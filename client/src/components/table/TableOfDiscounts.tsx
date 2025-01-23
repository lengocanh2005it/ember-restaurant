"use client";
import LoadingPage from "@/components/LoadingPage";
import ModalUpdateDiscount from "@/components/modal/ModalUpdateDiscount";
import { useDeleteDiscount } from "@/hooks/use-delete-discount";
import { useDiscounts } from "@/hooks/use-discounts";
import { Discount } from "@/utils/types";
import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { TrashIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const columns = [
  { name: "TYPE", uid: "type" },
  { name: "VALUE", uid: "value" },
  { name: "START DATE", uid: "start_date" },
  { name: "END DATE", uid: "end_date" },
  { name: "STATUS", uid: "is_active" },
  { name: "CURRENCY", uid: "currency" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "OPTIONS", uid: "options" },
];

const TableOfDiscounts: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const { data, isLoading, isError } = useDiscounts();
  const { mutate: mutateDeleteDiscount } = useDeleteDiscount();
  const [page, setPage] = useState<number>(1);
  const initialPage = 3;

  const handleClick = useCallback(
    (discountId: string) => {
      mutateDeleteDiscount(discountId);
    },
    [mutateDeleteDiscount]
  );

  const totalPages = useMemo(() => {
    return Math.ceil(discounts?.length / initialPage) ?? 0;
  }, [discounts]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPage;
    const end = start + initialPage;

    return discounts?.slice(start, end) ?? [];
  }, [page, discounts]);

  useEffect(() => {
    if (data) {
      setDiscounts(data as Discount[]);
    }
  }, [data]);

  const renderCell = useCallback(
    (discount: Discount, columnKey: React.Key) => {
      const cellValue = discount[columnKey as keyof Discount];

      switch (columnKey) {
        case "is_active": {
          return (
            <Chip
              color={cellValue === true ? "success" : "danger"}
              variant="dot"
              className="border-none"
            >
              {cellValue === true ? "Active" : "In Active"}
            </Chip>
          );
        }

        case "options": {
          return (
            <div className="relative flex items-center gap-2">
              <ModalUpdateDiscount discount={discount} />

              <Tooltip content="Delete" className="bg-white text-black">
                <TrashIcon
                  className="cursor-pointer"
                  onClick={() => handleClick(discount.id)}
                />
              </Tooltip>
            </div>
          );
        }

        case "currency": {
          return <p>{(cellValue as string).toUpperCase()}</p>;
        }

        case "value": {
          return (
            <p>
              {discount.type === "fixed"
                ? discount.currency === "vnd"
                  ? cellValue + " VND"
                  : cellValue + " USD"
                : discount.currency === "vnd"
                ? cellValue + "% VND"
                : cellValue + "% USD"}
            </p>
          );
        }

        case "type": {
          return <p>{cellValue === "percentage" ? "Percentage" : "Fixed"}</p>;
        }

        default:
          return (
            <p className="max-w-[400px] truncate">
              {cellValue ? cellValue : "Null"}
            </p>
          );
      }
    },
    [handleClick]
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex flex-col lg:gap-4 gap-3 relative">
      <Table aria-label="Table of discounts" isCompact isHeaderSticky isStriped>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty discounts.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {discounts.length !== 0 && (
        <div className="relative flex lg:items-start items-center lg:justify-start justify-center">
          <Pagination
            initialPage={page}
            total={totalPages}
            showControls
            showShadow
            onChange={(page) => setPage(page)}
            isCompact
            classNames={{
              cursor: "dark:bg-white dark:text-black bg-black text-white",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TableOfDiscounts;
