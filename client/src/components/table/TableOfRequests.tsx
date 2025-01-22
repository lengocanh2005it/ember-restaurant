"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Pagination,
  Tooltip,
} from "@nextui-org/react";
import { TrashIcon } from "lucide-react";
import ModalUpdateRequest from "@/components/modal/ModalUpdateRequest";
import { useDeleteSupportTicket } from "@/hooks/use-delete-support-ticket";
import ModalViewResponse from "@/components/modal/ModalViewResponse";
import { DeleteSupportTicketDto } from "@/api/support-ticket/utils/types";
import { format } from "date-fns";
import { Request } from "@/utils";
import { useUserStore } from "@/store";

const columns = [
  { name: "DATE TIME", uid: "createdAt" },
  { name: "ORIGINAL REQUEST", uid: "original_request" },
  { name: "STATUS", uid: "status" },
  { name: "OPTIONS", uid: "options" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  success: "success",
  pending: "warning",
  error: "danger",
};

const TableOfRequests: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [requests, setRequests] = useState<Request[]>([]);
  const { user } = useUserStore();
  const initialPages = 4;

  const { mutate: mutateDeleteSupportTicket } = useDeleteSupportTicket();

  useEffect(() => {
    if (user && user.support_tickets) {
      console.log(user);
      setRequests(user.support_tickets as Request[]);
    }
  }, [user]);

  const handleClick = useCallback(
    (requestId: string) => {
      const data: DeleteSupportTicketDto = {
        userId: user?.id!,
        requestId,
      };
      mutateDeleteSupportTicket(data);
    },
    [mutateDeleteSupportTicket, user]
  );

  const totalPages = useMemo(() => {
    return Math.ceil(requests?.length / initialPages) ?? 0;
  }, [requests]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return requests?.slice(start, end) ?? [];
  }, [requests, page]);

  const renderCell = useCallback(
    (request: Request, columnKey: React.Key) => {
      const cellValue = request[columnKey as keyof Request];

      switch (columnKey) {
        case "status": {
          return (
            <Chip
              className="border-none"
              color={statusColorMap[request.status]}
              variant="dot"
            >
              {(cellValue as string).charAt(0).toUpperCase() +
                (cellValue as string).substring(1)}
            </Chip>
          );
        }

        case "options":
          return (
            <div className="relative flex items-center gap-2">
              <ModalUpdateRequest requestData={request} />

              <Tooltip content="Delete" className="dark:bg-white text-black">
                <TrashIcon
                  className="cursor-pointer"
                  onClick={() => handleClick(request.id)}
                />
              </Tooltip>

              {request.ticket_messages &&
                request.ticket_messages.length > 1 && (
                  <ModalViewResponse request={request} />
                )}
            </div>
          );

        case "original_request": {
          return (
            <p className="lg:max-w-[400px] max-w-full break-words truncate">
              {cellValue as string}
            </p>
          );
        }

        case "createdAt": {
          return (
            <p className="lg:max-w-[150px] truncate max-w-fit">
              {format(request.createdAt, "dd/MM/yyyy HH:mm:ss")}
            </p>
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
      <Table
        aria-label="Table of request"
        className="relative lg:w-[85%] w-full mx-auto"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty requests.">
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
        <div className="relative flex items-center justify-center">
          <Pagination
            initialPage={page}
            total={totalPages}
            onChange={(e) => setPage(e)}
            isCompact
            loop
            showControls
            showShadow
            classNames={{
              cursor: "dark:bg-white dark:text-black text-white bg-black",
            }}
          />
        </div>
      )}
    </>
  );
};

export default TableOfRequests;
