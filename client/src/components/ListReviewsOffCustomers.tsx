"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LoadingPage from "@/components/LoadingPage";
import { useCustomers } from "@/hooks/use-users";
import Image from "next/image";
import { EyeIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/utils";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "PHONE NUMBER", uid: "phone" },
  { name: "EMAIL", uid: "email" },
  { name: "REVIEWS", uid: "reviews" },
];

const ListReviewsOffCustomers: React.FC = () => {
  const query = useQueryClient();
  const { data, isLoading, isError } = useCustomers();
  const [customers, setCustomers] = useState<User[]>([]);
  const itemsPerPage = 3;
  const [page, setPage] = useState<number>(1);

  const router = useRouter();

  const pathname = usePathname();

  const totalPages = useMemo(() => {
    return Math.ceil(customers.length / itemsPerPage) ?? 0;
  }, [customers]);

  const items = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return customers?.slice(start, end) ?? [];
  }, [customers, page]);

  const renderCell = useCallback(
    (user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User];

      switch (columnKey) {
        case "name": {
          return (
            <div className="relative flex items-center gap-2 text-base">
              <div
                className="relative w-[50px] h-[50px] 
              rounded-full lg:block hidden"
              >
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.username ? user.username : "image"}
                    fill
                    priority
                    className="object-cover select-none rounded-full"
                  />
                )}
              </div>

              <div className="flex flex-col relative lg:text-[14px] text-[13px]">
                <p>{user.name ? user.name : user.username}</p>

                <p>Username: {user.username ? user.username : "Null"}</p>
              </div>
            </div>
          );
        }

        case "reviews": {
          return (
            <Tooltip
              content="See reviews"
              showArrow
              className="dark:text-white text-black"
            >
              <EyeIcon
                className="opacity-50 hover:opacity-100 duration-250 
                ease-in-out transition-opacity
            cursor-pointer"
                onClick={() => {
                  query.setQueryData(["customer"], user);
                  router.push(`${pathname}/user/${user.id}`);
                }}
              />
            </Tooltip>
          );
        }

        default: {
          return (
            <p>
              {(cellValue as string | number)
                ? (cellValue as string | number)
                : "Null"}
            </p>
          );
        }
      }
    },
    [pathname, router, query]
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
    <div
      className="relative flex lg:gap-3 gap-2 flex-col lg:items-start lg:justify-start 
    items-center justify-center"
    >
      <Table aria-label="List reviews off all customers.">
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

      {customers.length !== 0 && (
        <div
          className="relative flex flex-col lg:items-start lg:justify-start items-center justify-center 
          lg:mx-0 mx-auto"
        >
          <Pagination
            initialPage={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
            showControls
            showShadow
            classNames={{
              cursor: "bg-white text-black",
            }}
            isCompact
          />
        </div>
      )}
    </div>
  );
};

export default ListReviewsOffCustomers;
