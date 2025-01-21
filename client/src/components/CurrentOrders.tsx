"use client";
import CurrentOrdersTable from "@/components/table/CurrentOrdersTable";
import { Order } from "@/utils/types";
import { Pagination } from "@nextui-org/react";
import React, { useState } from "react";

interface CurrentOrdersProps {
  orders: Order[];
}

const CurrentOrders: React.FC<CurrentOrdersProps> = ({ orders }) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 3;

  const array = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return orders.slice(start, end);
  }, [page, orders]);

  const totalPages = React.useMemo(() => {
    return Math.ceil((orders.length ?? 0) / itemsPerPage);
  }, [orders]);

  return (
    <div className="flex flex-col lg:gap-4 gap-3">
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center"
      >
        <h2 className="lg:text-2xl text-xl font-bold md:text-left text-center">
          Current Orders
        </h2>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Explore your current orders, track their progress, and enjoy a
          seamless dining experience.
        </p>
      </div>

      <>
        <CurrentOrdersTable orders={array} />

        {orders.length !== 0 && (
          <div className="flex md:justify-start justify-center">
            <Pagination
              loop
              showControls
              total={totalPages}
              showShadow
              isCompact
              page={page}
              classNames={{
                cursor: "dark:bg-white dark:text-black",
              }}
              onChange={(page) => setPage(page)}
            />
          </div>
        )}
      </>
    </div>
  );
};

export default CurrentOrders;
