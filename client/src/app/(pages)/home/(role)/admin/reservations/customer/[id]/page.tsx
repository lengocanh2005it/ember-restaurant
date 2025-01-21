import React from "react";
import ListReservationsOfCustomer from "@/components/ListReservationsOfCustomer";

const ReservationsOfCustomer: React.FC = () => {
  return (
    <main className="relative w-full container mx-auto px-4 py-6">
      <div
        className="flex flex-col relative lg:items-start lg:justify-start items-center 
      justify-center lg:text-left text-center"
      >
        <h1 className="lg:text-xl text-base uppercase font-bold">
          All Reservations Of The Customer
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Below is the list of customer reservations.
        </p>
      </div>

      <ListReservationsOfCustomer />
    </main>
  );
};

export default ReservationsOfCustomer;
