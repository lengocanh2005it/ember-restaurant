"use client";
import React from "react";
import TableOfPromotions from "@/components/table/TableOfPromotions";
import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

const PromotionsPage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    router.push(`${pathname}/add`);
  };

  return (
    <section className="relative container mx-auto lg:px-6 py-4 flex flex-col lg:gap-5 gap-3">
      <div
        className="relative flex lg:flex-row flex-col items-center justify-center
       lg:justify-between gap-2"
      >
        <div
          className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
        >
          <h1 className="lg:text-2xl text-xl uppercase font-bold">
            All promotions
          </h1>

          <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
            Here are all the current promotions available at the restaurant.
          </p>
        </div>

        <Button
          color="primary"
          className="dark:bg-white dark:text-black w-fit"
          onPress={handleClick}
        >
          Create new promotion
        </Button>
      </div>

      <TableOfPromotions />
    </section>
  );
};

export default PromotionsPage;
