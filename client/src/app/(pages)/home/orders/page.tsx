"use client";
import CurrentOrders from "@/components/CurrentOrders";
import FeedbackOrders from "@/components/FeedbackOrders";
import LoadingPage from "@/components/LoadingPage";
import OrdersHistory from "@/components/OrdersHistory";
import SpecialOffers from "@/components/SpecialOffers";
import { useOrder } from "@/hooks/use-orders-of-user";
import { useUserStore } from "@/store";
import { Order } from "@/utils/types";
import React, { useState } from "react";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const { user } = useUserStore();

  const {
    data,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useOrder(user?.id!);

  React.useEffect(() => {
    if (data) {
      setOrders(data.currentOrders as Order[]);
      setHistoryOrders(data.historyOrders as Order[]);
    }
  }, [data]);

  if (isOrdersLoading) {
    return <LoadingPage />;
  }

  if (isOrdersError) {
    return <div>Error...</div>;
  }

  return (
    <div className="w-full h-fit container flex mx-auto flex-col gap-6 py-6">
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center"
      >
        <h1 className="lg:text-2xl text-xl font-bold md:text-left text-center">
          Your Orders
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Explore your order history and enjoy a seamless experience as you
          track and manage your purchases.
        </p>
      </div>

      <div className="flex flex-col xl:gap-6 lg:gap-5 md:gap-4 gap-6 lg:px-4">
        <>
          <CurrentOrders orders={orders} />

          <OrdersHistory orders={historyOrders} />
        </>

        <SpecialOffers />

        {historyOrders.length !== 0 && (
          <FeedbackOrders orders={historyOrders.map((order) => order.id)} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
