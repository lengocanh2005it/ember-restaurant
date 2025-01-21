"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Chip,
  ChipProps,
} from "@nextui-org/react";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import ModalViewRequest from "@/components/modal/ModalViewRequest";
import ModalReply from "@/components/modal/ModalReply";
import { useDeleteSupportTicket } from "@/hooks/use-delete-support-ticket";
import { format } from "date-fns";
import { Request } from "@/utils";

const columns = [
  { name: "DATE", uid: "date" },
  { name: "CUSTOMER", uid: "user" },
  { name: "REQUEST", uid: "original_request" },
  { name: "STATUS", uid: "status" },
  { name: "OPTIONS", uid: "options" },
];

interface TableRequestsOfCustomersProps {
  requests: Request[];
}

const statusColorMap: Record<string, ChipProps["color"]> = {
  success: "success",
  pending: "warning",
  error: "danger",
};

const TableRequestsOfCustomers: React.FC<TableRequestsOfCustomersProps> = ({
  requests,
}) => {
  const [page, setPage] = useState<number>(1);
  const initialPages = 3;

  const { mutate: mutateDeleteRequestAdmin } = useDeleteSupportTicket();

  const handleClick = useCallback(
    (requestId: string, userId: string) => {
      mutateDeleteRequestAdmin({
        requestId,
        userId,
      });
    },
    [mutateDeleteRequestAdmin]
  );

  const totalPages = useMemo(() => {
    return Math.ceil(requests?.length / initialPages) ?? 0;
  }, [requests]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return requests?.slice(start, end) ?? [];
  }, [page, requests]);

  const renderCell = useCallback(
    (request: Request, columnKey: React.Key) => {
      const cellValue = request[columnKey as keyof Request];

      switch (columnKey) {
        case "date": {
          return <p>{format(request.createdAt, "dd/MM/yyyy")}</p>;
        }

        case "user": {
          const { image, name, username, email } = request.user;

          return (
            <div className="relative flex items-center gap-2">
              <div className="relative w-[50px] h-[50px] rounded-full sm:block hidden">
                {image && (
                  <Image
                    src={image}
                    alt=""
                    priority
                    sizes="(max-width:600px) 100vw, 50vw"
                    fill
                    className="object-cover select-none rounded-full"
                  />
                )}
              </div>

              <div className="flex flex-col">
                <h1>{name ? name : username}</h1>

                <p className="dark:text-white/50 text-black/60">
                  {email ? email : "Email: Null"}
                </p>
              </div>
            </div>
          );
        }

        case "original_request": {
          return (
            <p className="lg:max-w-[500px] max-w-[350px] truncate">
              {cellValue as string}
            </p>
          );
        }

        case "status": {
          return (
            <Chip
              color={statusColorMap[cellValue as string]}
              variant="dot"
              className="border-none"
            >
              {(cellValue as string).charAt(0).toUpperCase() +
                (cellValue as string).substring(1)}
            </Chip>
          );
        }

        case "options": {
          return (
            <div className="relative flex items-center gap-2">
              <ModalViewRequest request={request} user={request.user} />

              <ModalReply request={request} />

              <Tooltip content="Delete" className="dark:text-white text-black">
                <TrashIcon
                  className="cursor-pointer"
                  onClick={() => {
                    const { id, user } = request;
                    handleClick(id, user.id);
                  }}
                />
              </Tooltip>
            </div>
          );
        }

        default:
          return <p>{cellValue as string}</p>;
      }
    },
    [handleClick]
  );

  return (
    <>
      <Table aria-label="Table of all requests" isHeaderSticky isStriped>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty requests from customers.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {requests.length !== 0 && (
        <div className="relative flex lg:items-start lg:justify-start items-center justify-center">
          <Pagination
            initialPage={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
            showControls
            showShadow
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

export default TableRequestsOfCustomers;
