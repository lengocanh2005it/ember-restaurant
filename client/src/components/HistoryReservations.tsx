"use client";
import ReservationList from "@/components/HistoryReservationList";
import LoadingPage from "@/components/LoadingPage";
import { useReservation } from "@/hooks/user-reservation-of-users";
import { useUserStore } from "@/store";
import { Reservation } from "@/utils";
import React, { useEffect, useState } from "react";

const HistoryReservations: React.FC = () => {
  const { user } = useUserStore();
  const [historyReservations, setHistoryReservations] = useState<Reservation[]>(
    []
  );

  const { data, isLoading, isError } = useReservation(user?.id!);

  useEffect(() => {
    if (data && data.historyReservations) {
      const reservations: Reservation[] = data.historyReservations.map(
        (reservation: Reservation) => ({
          ...reservation,
          date: reservation.date_time,
          note: reservation.note,
        })
      );
      setHistoryReservations(reservations);
    }
  }, [data, setHistoryReservations]);

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
          className="md:text-2xl text-xl font-bold text-black dark:text-white 
      md:text-left text-center"
        >
          History Reservations
        </h1>

        <p
          className="xl:text-base md:text-[14px] text-12px md:text-left text-center
       dark:text-white/70"
        >
          Below is your history reservations{" "}
          <span className="dark:text-white/40 text-black/60 italic">
            (a few days ago)
          </span>
          .
        </p>
      </div>

      <ReservationList reservations={historyReservations} />
    </div>
  );
};

export default HistoryReservations;
