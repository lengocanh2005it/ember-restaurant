"use client";
import ModalDeleteCustomer from "@/components/modal/ModalDeleteCustomer";
import ModalUpdateProfile from "@/components/modal/ModalUpdateProfile";
import ModalViewCustomer from "@/components/modal/ModalViewCustomer";
import { User } from "@/utils";
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
} from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  online: "success",
  offline: "default",
};

const columns = [
  { name: "CUSTOMER", uid: "name" },
  { name: "JOB", uid: "job" },
  { name: "PHONE", uid: "phone" },
  { name: "ADDRESS", uid: "address" },
  { name: "STATUS", uid: "status" },
  { name: "OPTIONS", uid: "actions" },
];

interface TableCustomersProps {
  users: User[];
}

const TableCustomers: React.FC<TableCustomersProps> = ({ users }) => {
  const [page, setPage] = React.useState<number>(1);

  const itemsPerPage = 3;

  const totalPages = React.useMemo(() => {
    return Math.ceil((users.length ?? 0) / itemsPerPage);
  }, [users]);

  const items = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return users?.slice(start, end);
  }, [page, users]);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name": {
        return (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="relative rounded-full w-[50px] h-[50px] lg:block hidden">
              {user && user.image && (
                <Image
                  src={user.image}
                  alt=""
                  priority
                  sizes="(max-width: 600px) 100vw, 50vw"
                  fill
                  className="rounded-full object-cover"
                />
              )}
            </div>

            <div className="flex flex-col">
              <h1>
                {(cellValue as string | number)
                  ? (cellValue as string | number)
                  : user.username}
              </h1>

              <p className="dark:text-white/80 text-black/80">
                {user.email ? "Email: " + user.email : "Email: Null"}
              </p>
            </div>
          </div>
        );
      }

      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              statusColorMap[
                (user as any).status as keyof typeof statusColorMap
              ]
            }
            size="sm"
            variant="flat"
          >
            {cellValue as string | number}
          </Chip>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            <ModalViewCustomer key={1} user={user} />

            <ModalUpdateProfile key={2} user={user} />

            <ModalDeleteCustomer key={3} userId={user.id} />
          </div>
        );
      default:
        return (
          <p>
            {(cellValue as string | number)
              ? (cellValue as string | number)
              : "Null"}
          </p>
        );
    }
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <Table aria-label="Customers List" isHeaderSticky>
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

      {users.length !== 0 && (
        <div className="relative flex lg:items-start lg:justify-start items-center justify-center">
          <Pagination
            showControls
            isCompact
            showShadow
            total={totalPages}
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            initialPage={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default TableCustomers;
