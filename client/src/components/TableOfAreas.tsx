"use client";
import ModalViewArea from "@/components/modal/ModalViewArea";
import { useDeleteArea } from "@/hooks/use-delete-area";
import { Area } from "@/utils/types";
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
import { SquarePenIcon, TrashIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "CAPACITY NUMBER", uid: "capacity" },
  { name: "FLOOR NUMBER", uid: "floor_number" },
  { name: "OPERATING HOURS", uid: "operating_hours" },
  { name: "STATUS", uid: "status" },
  { name: "OPTIONS", uid: "options" },
];

interface TableOfAreasProps {
  areas: Area[];
}

const statusMap = {
  running: "Running",
  maintenance: "Maintenance",
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  running: "success",
  maintenance: "danger",
};

const TableOfAreas: React.FC<TableOfAreasProps> = ({ areas }) => {
  const [page, setPage] = useState<number>(1);
  const initialPages = 3;
  const pathName = usePathname();
  const router = useRouter();

  const handleClickEdit = useCallback(
    (areaId: string) => {
      router.push(`${pathName}/edit/?id=${areaId}`);
    },
    [pathName, router]
  );

  const { mutate: mutateDeleteArea } = useDeleteArea();

  const totalPages = useMemo(() => {
    return Math.ceil((areas?.length ?? 0) / initialPages) ?? 0;
  }, [areas]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return areas?.slice(start, end) ?? [];
  }, [areas, page]);

  const renderCell = React.useCallback(
    (area: Area, columnKey: React.Key) => {
      const cellValue = area[columnKey as keyof typeof area];

      switch (columnKey) {
        case "capacity": {
          return <p>{cellValue as number} Guests</p>;
        }
        case "status": {
          return (
            <Chip
              color={statusColorMap[area.status as keyof typeof statusColorMap]}
              variant="dot"
              className="border-none"
            >
              {statusMap[area.status as keyof typeof statusMap]}
            </Chip>
          );
        }
        case "options": {
          return (
            <div className="flex items-center gap-1">
              <ModalViewArea area={area} />

              <Tooltip content="Edit" className="dark:text-white text-black">
                <SquarePenIcon
                  className="cursor-pointer opacity-70 hover:opacity-100 ease-in-out duration-250
              transition-opacity"
                  onClick={() => {
                    handleClickEdit(area.id);
                  }}
                />
              </Tooltip>

              <Tooltip content="Delete" className="dark:text-white text-black">
                <TrashIcon
                  className="cursor-pointer opacity-70 hover:opacity-100 ease-in-out duration-250
              transition-opacity"
                  onClick={() => mutateDeleteArea(area.id)}
                />
              </Tooltip>
            </div>
          );
        }
        default:
          return (
            <p className="lg:max-w-[400px] max-w-[250px] truncate break-words">
              {cellValue as string | number}
            </p>
          );
      }
    },
    [handleClickEdit, mutateDeleteArea]
  );

  return (
    <>
      <Table aria-label="areas_table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "status" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty areas.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {areas.length !== 0 && (
        <div className="relative flex lg:justify-start lg:items-start justify-center items-center">
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
    </>
  );
};

export default TableOfAreas;
