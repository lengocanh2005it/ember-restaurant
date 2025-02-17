"use client";
import LoadingPage from "@/components/LoadingPage";
import ModalConfirmDeleteRequest from "@/components/modal/ModalConfirmDeleteRequest";
import ModalUpdateRequest from "@/components/modal/ModalUpdateRequest";
import ModalViewResponse from "@/components/modal/ModalViewResponse";
import { useDeleteSupportTicket } from "@/hooks/use-delete-support-ticket";
import { useRequestsOfUser } from "@/hooks/use-requests-of-user";
import { useUserStore } from "@/store";
import { Request } from "@/utils";
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
} from "@heroui/react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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

  const { data, isLoading, isError } = useRequestsOfUser(user?.id!);

  useEffect(() => {
    if (data) {
      setRequests(data as Request[]);
    }
  }, [data]);

  const totalPages = useMemo(() => {
    return Math.ceil(requests?.length / initialPages) ?? 0;
  }, [requests]);

  const items = useMemo(() => {
    const start = (page - 1) * initialPages;
    const end = start + initialPages;

    return requests?.slice(start, end) ?? [];
  }, [requests, page]);

  const renderCell = useCallback((request: Request, columnKey: React.Key) => {
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

            <ModalConfirmDeleteRequest requestId={request.id} />

            {request.ticket_messages && request.ticket_messages.length > 1 && (
              <ModalViewResponse request={request} />
            )}
          </div>
        );

      case "original_request": {
        return (
          <p className="lg:max-w-[80%] max-w-full break-words">
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
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

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
