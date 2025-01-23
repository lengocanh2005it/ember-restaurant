"use client";
import TableOfDiscounts from "@/components/table/TableOfDiscounts";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const DiscountsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push(`${pathname}/add`);
  };

  return (
    <main className="container mx-auto flex flex-col lg:gap-4 gap-2 lg:px-6 lg:py-8 py-4">
      <div
        className="relative flex items-center lg:justify-between lg:px-4
       px-2 lg:flex-row flex-col gap-2 justify-center"
      >
        <div
          className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
        >
          <h1 className="lg:text-2xl text-xl uppercase font-bold">
            All Discounts
          </h1>

          <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
            Here are all the discounts available at the restaurant.
          </p>
        </div>

        <Button
          className="dark:bg-white dark:text-black w-fit"
          color="primary"
          onPress={handleClick}
        >
          Add New Discount
        </Button>
      </div>

      <TableOfDiscounts />
    </main>
  );
};

export default DiscountsPage;
