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
  Chip,
  ChipProps,
} from "@heroui/react";
import { useEvents } from "@/hooks/use-events";
import LoadingPage from "@/components/LoadingPage";
import ModalViewEvent from "@/components/modal/ModalViewEvent";
import ModalConfirmDeleteEvent from "@/components/modal/ModalConfirmDeleteEvent";
import ModalUpdateEvent from "@/components/modal/ModalUpdateEvent";
import { Event } from "@/utils/types";
import { format } from "date-fns";

const statusMap = {
  scheduled: "Scheduled",
  ongoing: "On Going",
  finished: "Finished",
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  ongoing: "success",
  scheduled: "warning",
  finished: "danger",
};

const columns = [
  { name: "START DATE", uid: "start_date" },
  { name: "END DATE", uid: "end_date" },
  { name: "TITLE", uid: "title" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "NOTE", uid: "note" },
  { name: "STATUS", uid: "status" },
  { name: "OPTIONS", uid: "options" },
];

const TableEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const { data, isLoading, isError } = useEvents();

  useEffect(() => {
    if (data) {
      setEvents(data as Event[]);
    }
  }, [data]);

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;

  const totalPages = useMemo(() => {
    return Math.ceil(events?.length / itemsPerPage) ?? 0;
  }, [events]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return events?.slice(start, end) ?? [];
  }, [page, events]);

  const renderCell = useCallback((event: Event, columnKey: React.Key) => {
    const cellValue = event[columnKey as keyof Event];

    switch (columnKey) {
      case "status": {
        return (
          <Chip
            color={statusColorMap[cellValue as keyof typeof statusColorMap]}
            variant="dot"
          >
            {statusMap[cellValue as keyof typeof statusMap]}
          </Chip>
        );
      }
      case "start_date": {
        return (
          <p>
            {format(
              event?.start_date ? event.start_date : new Date(),
              "dd/MM/yyyy"
            )}
          </p>
        );
      }
      case "end_date": {
        return (
          <p>
            {format(
              event?.end_date ? event.end_date : new Date(),
              "dd/MM/yyyy"
            )}
          </p>
        );
      }
      case "options": {
        return (
          <div className="relative flex items-center gap-2">
            <ModalViewEvent event={event} />

            <ModalUpdateEvent event={event} />

            <ModalConfirmDeleteEvent eventId={event.id} />
          </div>
        );
      }
      default:
        return (
          <p className="lg:max-w-[300px] max-w-[200px] truncate">
            {cellValue ? cellValue : "Null"}
          </p>
        );
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
      <Table aria-label="Table of all events.">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty events.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {events.length !== 0 && (
        <div className="relative flex lg:items-start lg:justify-start items-center justify-center">
          <Pagination
            initialPage={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
            showControls
            showShadow
            isCompact
            classNames={{
              cursor: "bg-white text-black",
            }}
          />
        </div>
      )}
    </>
  );
};

export default TableEvents;
