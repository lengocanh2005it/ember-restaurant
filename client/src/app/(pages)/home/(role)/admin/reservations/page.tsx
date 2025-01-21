import ListOfReservations from "@/components/ListOfReservations";
import React from "react";

const ReservationAdminPage: React.FC = () => {
  return (
    <main className="relative container mx-auto px-4 py-6 flex flex-col gap-4">
      <div
        className="flex flex-col lg:text-left text-center lg:items-start items-center lg:justify-start
      justify-center"
      >
        <h1 className="lg:text-2xl text-xl uppercase font-bold">
          All Reservations
        </h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Here is a list of customers, click on a specific customer to view all
          their reservations.
        </p>
      </div>

      <ListOfReservations />
    </main>
  );
};

export default ReservationAdminPage;
