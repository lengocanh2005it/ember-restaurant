"use client";
import React from "react";
import TableEvents from "@/components/TableEvents";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

const EventsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push(`${pathname}/add`);
  };

  return (
    <section className="container mx-auto lg:px-4 py-6 flex flex-col lg:gap-4 gap-3">
      <div
        className="flex lg:flex-row flex-col
       lg:justify-between justify-center items-center gap-2 lg:text-base text-[14px] px-4"
      >
        <div
          className="flex flex-col lg:items-start items-center lg:justify-start 
        justify-center lg:text-left text-center"
        >
          <h1 className="lg:text-2xl text-xl uppercase font-bold">
            All Events
          </h1>

          <p className="lg:text-base text-[14px] dark:text-white/70 text-black/80">
            Below are all events of the restaurant.
          </p>
        </div>

        <Button
          color="primary"
          className="dark:bg-white dark:text-black w-fit"
          onPress={handleClick}
        >
          Create New Event
        </Button>
      </div>

      <TableEvents />
    </section>
  );
};

export default EventsPage;
