"use client";
import { TableOrders } from "@/components/TableOrders";
import { Order } from "@/utils/types";
import React from "react";

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  return (
    <div className="flex flex-col lg:gap-3 gap-4">
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center"
      >
        <h2 className="lg:text-2xl text-xl font-bold md:text-left text-center">
          History Orders
        </h2>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Your order history, a reflection of your dining journey. Revisit and
          reorder your favorites.
        </p>
      </div>

      <TableOrders arrays={orders} />
    </div>
  );
};

export default OrderHistory;
