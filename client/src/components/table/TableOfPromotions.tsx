"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Tooltip,
} from "@heroui/react";
import { SquarePenIcon } from "lucide-react";
import { usePromotions } from "@/hooks/use-promotions";
import LoadingPage from "@/components/LoadingPage";
import ModalConfirmDeletePromotion from "@/components/modal/ModalConfirmDeletePromotion";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ModalViewPromotion from "@/components/modal/ModalViewPromotion";
import { Promotion } from "@/utils";

const columns = [
  { name: "START DATE", uid: "start_date" },
  { name: "END DATE", uid: "end_date" },
  { name: "TITLE", uid: "title" },
  { name: "CODE", uid: "code" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "NOTE", uid: "note" },
  { name: "OPTIONS", uid: "options" },
];

const TableOfPromotions: React.FC = () => {
  const { data, isLoading, isError } = usePromotions();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;
  const router = useRouter();
  const pathname = usePathname();
  const query = useQueryClient();

  const totalPages = useMemo(() => {
    return Math.ceil(promotions?.length / itemsPerPage) ?? 0;
  }, [promotions]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return promotions?.slice(start, end) ?? [];
  }, [page, promotions]);

  useEffect(() => {
    if (data) {
      setPromotions(data as Promotion[]);
    }
  }, [data]);

  const handleClick = useCallback(() => {
    router.push(`${pathname}/edit`);
  }, [pathname, router]);

  const renderCell = useCallback(
    (promotion: Promotion, columnKey: React.Key) => {
      const cellValue = promotion[columnKey as keyof Promotion];

      switch (columnKey) {
        case "start_date": {
          return (
            <p>
              {(cellValue as string)
                ? (cellValue as string).split("T")[0]
                : "Null"}
            </p>
          );
        }
        case "end_date": {
          return (
            <p>{cellValue ? (cellValue as string).split("T")[0] : "Null"}</p>
          );
        }
        case "options": {
          return (
            <div className="flex items-center gap-2">
              <ModalViewPromotion promotion={promotion} />

              <Tooltip
                content="Edit"
                showArrow
                className="dark:bg-white text-black"
              >
                <SquarePenIcon
                  className="opacity-50 hover:opacity-100 
                duration-250 ease-in-out transition-opacity cursor-pointer select-none"
                  onClick={() => {
                    query.setQueryData(["promotion"], promotion);
                    handleClick();
                  }}
                />
              </Tooltip>

              <ModalConfirmDeletePromotion promotionId={promotion.id} />
            </div>
          );
        }
        default:
          return (
            <p className="max-w-[300px] truncate">
              {(cellValue as string | number)
                ? (cellValue as string | number)
                : "Null"}
            </p>
          );
      }
    },
    [handleClick, query]
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <Table
        aria-label="Table of promotions"
        isCompact
        isHeaderSticky
        isStriped
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty promotions.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {promotions.length !== 0 && (
        <div className="relative flex lg:items-start items-center lg:justify-start justify-center">
          <Pagination
            initialPage={page}
            total={totalPages}
            showControls
            showShadow
            isCompact
            onChange={(page) => setPage(page)}
            classNames={{
              cursor: "bg-white text-black",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TableOfPromotions;
