"use client";
import ListOrdersOfCustomer from "@/components/ListOrdersOfCustomer";
import LoadingPage from "@/components/LoadingPage";
import { useOrder } from "@/hooks/use-orders-of-user";
import { Order } from "@/utils/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrderOfCustomerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const params = useParams();

  const { id } = params;

  const { data, isLoading, isError } = useOrder(id as string);

  useEffect(() => {
    if (data) {
      setOrders(data.historyOrders as Order[]);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <main className="relative w-full lg:container mx-auto lg:px-4 py-6">
      <div
        className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          All Orders Of The Customer
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
          Below is the list of customer orders.
        </p>
      </div>

      <ListOrdersOfCustomer orders={orders} />
    </main>
  );
};

export default OrderOfCustomerPage;
