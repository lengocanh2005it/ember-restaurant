"use client";
import React, { useState, useEffect } from "react";
import TableRequestsOfCustomers from "@/components/table/TableRequestsOfCustomers";
import { useRequests } from "@/hooks/use-support-tickets";
import LoadingPage from "@/components/LoadingPage";
import { Request } from "@/utils/types";

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  const { data, isLoading, isError } = useRequests();

  useEffect(() => {
    if (data) {
      setRequests(data as Request[]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <section className="relative container mx-auto lg:px-6 py-8 flex flex-col gap-4">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          All Requests From Customers
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Here is the list of all requests from customers.
        </p>
      </div>

      <TableRequestsOfCustomers requests={requests} />
    </section>
  );
};

export default RequestsPage;
