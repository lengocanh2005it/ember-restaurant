"use client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import LoadingPage from "@/components/LoadingPage";
import { useCustomers } from "@/hooks/use-users";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import { MessageSquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/utils";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "JOB", uid: "job" },
  { name: "STATUS", uid: "status" },
  { name: "MESSAGE", uid: "message" },
];

const CustomersList: React.FC = () => {
  const router = useRouter();
  const query = useQueryClient();
  const [customers, setCustomers] = useState<User[]>([]);
  const { data, isLoading, isError } = useCustomers();
  const [page, setPage] = useState<number>(1);

  const itemsPerPage = 3;

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return customers?.slice(start, end) ?? [];
  }, [page, customers]);

  const totalPage = useMemo(() => {
    return Math.ceil(customers?.length / itemsPerPage) ?? 0;
  }, [customers]);

  const renderCell = useCallback(
    (customer: User, columnKey: React.Key) => {
      const cellValue = customer[columnKey as keyof User] as
        | string
        | number
        | string[];

      switch (columnKey) {
        case "name": {
          return (
            <div className="relative flex lg:flex-row flex-col lg:items-center gap-2">
              <div className="relative w-[60px] h-[60px] lg:block hidden rounded-full">
                {customer.image && (
                  <Image
                    src={customer.image}
                    alt={customer.image}
                    priority
                    sizes="(max-width: 600px) 100vw, 50vw"
                    fill
                    className="object-cover cursor-pointer rounded-full"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="lg:text-[15px] text-[13px] ">
                  {customer.name ? customer.name : customer.username}
                </h1>

                <p className="lg:text-[14px] text-[12px] dark:text-white/60 text-black/60">
                  {customer.email ? customer.email : "Email: Null"}
                </p>
              </div>
            </div>
          );
        }

        case "phone": {
          return (
            <p className="lg:text-[16px] text-[14px] dark:text-white/60 text-black/50">
              {(cellValue as string)
                ? (cellValue as string)
                : "Phone number: Null"}
            </p>
          );
        }

        case "job": {
          return (
            <p className="lg:text-[16px] text-[14px] dark:text-white/60 text-black/50">
              {customer.job ? customer.job : "Job: Null"}
            </p>
          );
        }

        case "status": {
          if (cellValue == "active") {
            return (
              <Chip color="success" variant="dot" className="border-none">
                Active
              </Chip>
            );
          } else {
            return (
              <Chip color="default" variant="dot" className="border-none">
                Offline
              </Chip>
            );
          }
        }

        case "message": {
          return (
            <Tooltip
              content="Chat"
              showArrow
              className="dark:text-white text-black"
            >
              <MessageSquareIcon
                className="opacity-50 hover:opacity-100 
            duration-250 ease-in-out transition-opacity cursor-pointer"
                onClick={() => {
                  query.setQueryData(["customer", customer.id!], customer);
                  router.push(`/home/admin/chat/${customer.id!}`);
                }}
              />
            </Tooltip>
          );
        }
        default: {
          return cellValue;
        }
      }
    },
    [router, query]
  );

  useEffect(() => {
    if (data) {
      setCustomers(data as User[]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      <Table aria-label="Customers List">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="Empty customers.">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {customers.length && (
        <>
          <Pagination
            initialPage={page}
            total={totalPage}
            onChange={(page) => setPage(page)}
            showShadow
            isCompact
            showControls
            classNames={{
              cursor: "bg-white text-black",
            }}
          />
        </>
      )}
    </>
  );
};

export default CustomersList;
