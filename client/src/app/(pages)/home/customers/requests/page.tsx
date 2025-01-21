import React from "react";
import TableOfRequests from "@/components/table/TableOfRequests";

const RequestsOfCustomers: React.FC = () => {
  return (
    <section className="relative container mx-auto lg:px-8 py-10 flex flex-col gap-4">
      <div
        className="relative flex flex-col lg:text-base text-[14px] lg:text-left text-center 
        lg:justify-start justify-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          All Requests
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Here is the list of requests you have submitted.
        </p>
      </div>

      <TableOfRequests />
    </section>
  );
};

export default RequestsOfCustomers;
