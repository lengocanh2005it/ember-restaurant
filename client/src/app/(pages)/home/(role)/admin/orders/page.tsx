import React from "react";
import TableOrdersOfCustomers from "@/components/TableOrdersOfCustomers";

const OrdersPage: React.FC = () => {
  return (
    <main className="relative container mx-auto lg:px-6 py-6 flex flex-col gap-4">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">ALL ORDERS</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Here is a list of customers, click on a specific customer to view all
          their orders.
        </p>
      </div>

      <TableOrdersOfCustomers />
    </main>
  );
};

export default OrdersPage;
