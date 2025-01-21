"use client";
import ReservationList from "@/components/HistoryReservationList";
import LoadingPage from "@/components/LoadingPage";
import { useReservation } from "@/hooks/user-reservation-of-users";
import { useUserStore } from "@/store";
import { Reservation } from "@/utils";
import React, { useEffect, useState } from "react";

const CurrentReservations: React.FC = () => {
  const { user } = useUserStore();

  const [currentReservations, setCurrentReservations] = useState<Reservation[]>(
    []
  );

  const { data, isLoading, isError } = useReservation(user?.id!);

  useEffect(() => {
    if (data && data.currentReservations) {
      setCurrentReservations(data.currentReservations as Reservation[]);
    }
  }, [data, setCurrentReservations]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex flex-col lg:gap-3 gap-2">
      <div className="flex flex-col">
        <h1
          className="md:text-2xl text-xl font-bold
       text-black dark:text-white md:text-left text-center"
        >
          Current Reservations
        </h1>

        <p
          className="xl:text-base md:text-[14px] text-12px dark:text-white/70 
      md:text-left text-center"
        >
          Below is your current reservations{" "}
          <span className="dark:text-white/40 text-black/60 italic">
            (in today)
          </span>
          .
        </p>
      </div>

      <ReservationList reservations={currentReservations} />
    </div>
  );
};

export default CurrentReservations;
