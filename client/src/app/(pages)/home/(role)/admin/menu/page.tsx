"use client";
import React from "react";
import DishesList from "@/components/DishesList";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

const MenuPage: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    router.push(`${pathname}/add`);
  };

  return (
    <main className="container mx-auto px-4 py-6 flex flex-col gap-6">
      <div
        className="relative flex lg:flex-row flex-col gap-3 items-center 
      lg:justify-between justify-center"
      >
        <div
          className="relative flex flex-col lg:justify-start 
        lg:items-start items-center justify-center lg:text-left text-center"
        >
          <h1 className="lg:text-2xl text-xl uppercase font-bold">
            All Dishes
          </h1>

          <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
            This page is used to view, edit, and remove dishes from the
            restaurant&apos;s menu.
          </p>
        </div>

        <Button
          color="primary"
          className="dark:bg-white dark:text-black text-white w-fit"
          onPress={handleClick}
        >
          Add New Dish
        </Button>
      </div>

      <DishesList />
    </main>
  );
};

export default MenuPage;
