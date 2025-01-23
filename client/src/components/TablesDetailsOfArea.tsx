"use client";
import { Area } from "@/utils";
import {
  Chip,
  ChipProps,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";
import React, { useMemo, useState } from "react";
import { Table as TableType } from "@/utils/types";
import { CheckIcon, SquarePenIcon, TrashIcon, XIcon } from "lucide-react";
import ModalEditTable from "@/components/modal/ModalEditTable";

interface TablesDetailsOfAreaProps {
  area: Area;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  running: "success",
  maintenance: "warning",
};

const statusMap = {
  running: "Running",
  maintenance: "Maintenance",
};

const typeMap = {
  normal: "Normal",
  vip: "VIP",
};

const columns = [
  { name: "NAME", uid: "name" },
  { name: "OPERATING STATUS", uid: "status" },
  { name: "PRICE", uid: "price" },
  { name: "TYPE", uid: "type" },
  { name: "CAPACITY NUMBER", uid: "capacity" },
  { name: "TABLE STATUS", uid: "is_reserved" },
  { name: "NOTE", uid: "note" },
  { name: "OPTIONS", uid: "options" },
];

const TablesDetailsOfArea: React.FC<TablesDetailsOfAreaProps> = ({ area }) => {
  const [page, setPage] = useState<number>(1);
  const initialPage = 3;

  const totalPages = useMemo(() => {
    return Math.ceil((area?.tables?.length ?? 0) / initialPage);
  }, [area]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPage;
    const end = start + initialPage;

    return area.tables.slice(start, end) ?? [];
  }, [area, page]);

  const renderCell = React.useCallback(
    (table: TableType, columnKey: React.Key) => {
      const cellValue = table[columnKey as keyof typeof table];

      switch (columnKey) {
        case "price": {
          return <p>{cellValue as number}$</p>;
        }
        case "type": {
          return <p>{typeMap[cellValue as string as keyof typeof typeMap]}</p>;
        }
        case "capacity": {
          return <p>{cellValue as number} Guests</p>;
        }
        case "is_reserved": {
          return (
            <Chip
              variant="dot"
              startContent={
                (cellValue as boolean) === true ? (
                  <XIcon className="dark:text-red-400 text-red-500" />
                ) : (
                  <CheckIcon className="dark:text-green-400 text-green-500" />
                )
              }
            >
              {(cellValue as boolean) === true
                ? "No Availability"
                : "Availability"}
            </Chip>
          );
        }
        case "status": {
          return (
            <Chip
              variant="dot"
              className="border-none"
              color={
                statusColorMap[
                  cellValue as string as keyof typeof statusColorMap
                ]
              }
            >
              {statusMap[cellValue as string as keyof typeof statusMap]}
            </Chip>
          );
        }
        case "options": {
          return (
            <div className="relative flex items-center gap-2">
              <ModalEditTable table={table} areaId={area.id} />

              <Tooltip content="Delete" className="dark:text-white text-black">
                <TrashIcon
                  className="cursor-pointer opacity-70 hover:opacity-100 duration-300 ease-in-out
                transition-opacity"
                />
              </Tooltip>
            </div>
          );
        }
        default:
          return (
            <p className="max-w-full truncate">
              {cellValue as string | number}
            </p>
          );
      }
    },
    [area]
  );

  return (
    <section className="relative flex flex-col lg:gap-4 gap-3">
      <div
        className="relative flex flex-col p-4 border dark:border-white/20 border-black/20 w-fit
      rounded-xl lg:px-6 px-4 lg:items-start lg:justify-start items-center justify-center lg:text-left
      text-center lg:mx-16 mx-auto"
      >
        <div className="flex items-center relative lg:flex-row flex-col">
          <Tooltip
            color="primary"
            className="text-white dark:bg-white dark:text-black"
            content={
              "Status: " + statusMap[area.status as keyof typeof statusMap]
            }
          >
            <Chip
              variant="dot"
              className="border-none cursor-pointer dark:text-white text-black"
              color={statusColorMap[area.status as keyof typeof statusColorMap]}
            ></Chip>
          </Tooltip>
          <h1 className="lg:text-2xl text-xl font-medium">{area.name}</h1>
        </div>

        <p
          className="lg:text-base text-[15px] dark:text-white/80 text-black/80 lg:max-w-[500px]
        max-w-full break-words"
        >
          {area.description}
        </p>
      </div>

      <div
        className="flex flex-col lg:gap-3 gap-2 lg:items-start
       items-center lg:justify-start justify-center"
      >
        <Table aria-label="Table Details">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {area && area.tables.length !== 0 && (
          <Pagination
            showControls
            total={totalPages}
            initialPage={page}
            isCompact
            showShadow
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            onChange={(page) => setPage(page)}
          />
        )}
      </div>
    </section>
  );
};

export default TablesDetailsOfArea;
