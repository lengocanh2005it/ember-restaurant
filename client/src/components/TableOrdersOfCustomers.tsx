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
} from "@nextui-org/react";
import Image from "next/image";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { useCustomers } from "@/hooks/use-users";
import LoadingPage from "@/components/LoadingPage";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/utils";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "PHONE NUMBER", uid: "phone" },
  { name: "EMAIL", uid: "email" },
  { name: "JOB", uid: "job" },
  { name: "ROLE", uid: "role" },
  { name: "VIEW ORDERS", uid: "view" },
];

const TableOrdersOfCustomers: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const query = useQueryClient();

  const { data: customers, isLoading, isError } = useCustomers();

  const { mutate: mutateCustomer } = useCustomer();

  const itemsPerPage = 3;

  const totalPages = useMemo(() => {
    return Math.ceil((customers?.length ?? 0) / itemsPerPage);
  }, [customers]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return customers?.slice(start, end) ?? [];
  }, [page, customers]);

  const renderCell = useCallback(
    (customer: User, columnKey: React.Key) => {
      const cellValue = customer[columnKey as keyof User];

      switch (columnKey) {
        case "role": {
          return <p>User</p>;
        }
        case "name": {
          return (
            <div className="flex items-center gap-3">
              <div className="relative w-[50px] h-[50px] rounded-full lg:block hidden">
                {customer && customer.image && (
                  <Image
                    src={customer.image}
                    alt=""
                    priority
                    sizes="(max-width: 600px) 100vw, 50vw"
                    fill
                    className="object-cover select-none cursor-pointer rounded-full"
                  />
                )}
              </div>

              <div className="flex flex-col relative">
                <p>{customer.name ? customer.name : customer.username}</p>

                <p>
                  Username: {customer.username ? customer.username : "Null"}
                </p>
              </div>
            </div>
          );
        }

        case "view": {
          return (
            <div className="flex flex-col items-center justify-center">
              <Tooltip content="Views">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    router.push(`/home/admin/orders/customer/${customer.id}`);
                    query.setQueryData(["customer"], customer);
                    mutateCustomer(customer.id!);
                  }}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
            </div>
          );
        }
        default:
          return (
            <p>
              {(cellValue as string | number)
                ? (cellValue as string | number)
                : "Null"}
            </p>
          );
      }
    },
    [router, mutateCustomer, query]
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      <Table aria-label="Orders of Customers">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "view" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item: User) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {customers?.length && (
        <div className="relative flex lg:justify-start lg:items-start justify-center items-center">
          <Pagination
            loop
            showControls
            isCompact
            showShadow
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="primary"
            total={totalPages}
            initialPage={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </>
  );
};

export default TableOrdersOfCustomers;
