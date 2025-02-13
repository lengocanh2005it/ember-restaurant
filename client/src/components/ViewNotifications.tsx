"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import ModalConfirmDeleteNotification from "@/components/modal/ModalConfirmDeleteNotification";
import ModalViewNotification from "@/components/modal/ModalViewNotification";
import ModalUpdateNotification from "@/components/modal/ModalUpdateNotification";
import { Notification } from "@/utils";
import { format } from "date-fns";

const columns = [
  { name: "DATE", uid: "createdAt" },
  { name: "TITLE", uid: "title" },
  { name: "CONTENT", uid: "content" },
  { name: "VIEWS NUMBER", uid: "number" },
  { name: "OPTIONS", uid: "options" },
];

interface ViewNotificationsProp {
  notifications: Notification[];
}

const ViewNotifications: React.FC<ViewNotificationsProp> = ({
  notifications,
}) => {
  const renderCell = React.useCallback(
    (notification: Notification, columnKey: React.Key) => {
      const cellValue = notification[columnKey as keyof Notification];

      switch (columnKey) {
        case "createdAt": {
          return (
            <p>
              {format(
                notification?.createdAt ? notification.createdAt : new Date(),
                "EEEE, dd/MM/yyyy"
              )}
            </p>
          );
        }
        case "title": {
          return (
            <p className="max-w-[300px] truncate">{cellValue as string}</p>
          );
        }
        case "content": {
          return (
            <p className="max-w-[500px] truncate">{cellValue as string}</p>
          );
        }
        case "number": {
          return <p>{cellValue + " People"}</p>;
        }
        case "options": {
          return (
            <div className="flex items-center gap-2">
              <ModalViewNotification notification={notification} />

              <ModalUpdateNotification notification={notification} />

              <ModalConfirmDeleteNotification
                notificationId={notification.id}
              />
            </div>
          );
        }
        default:
          return cellValue as string | number;
      }
    },
    []
  );

  return (
    <Table aria-label="Notifications List" className="container mx-auto px-4">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>

      <TableBody
        items={notifications}
        emptyContent="Ember restaurant doesn't have any notifications."
      >
        {(notification) => (
          <TableRow key={notification.id}>
            {(columnKey) => (
              <TableCell>{renderCell(notification, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ViewNotifications;
