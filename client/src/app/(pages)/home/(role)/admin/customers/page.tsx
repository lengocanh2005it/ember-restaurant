"use client";
import LoadingPage from "@/components/LoadingPage";
import TableCustomers from "@/components/TableCustomers";
import { useCustomers } from "@/hooks/use-users";
import { User } from "@/utils/types";
import React, { useEffect, useState } from "react";

const CustomersPage: React.FC = () => {
  const { data, isLoading, isError } = useCustomers();
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      const users = data.map((user: any) => ({
        ...user,
        status: "offline",
      }));

      setCustomers(users);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main
      className="w-full container mx-auto 
    lg:px-8 py-6 flex flex-col gap-4 relative"
    >
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          List of customers
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Here is the list of all the restaurant&apos;s customers.
        </p>
      </div>

      {customers.length !== 0 && <TableCustomers users={customers} />}
    </main>
  );
};

export default CustomersPage;
