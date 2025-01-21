"use client";
import CurrentReservations from "@/components/CurrentReservations";
import FeedbackReservations from "@/components/FeedbackReservations";
import ReservationForm from "@/components/form/ReservationForm";
import HistoryReservations from "@/components/HistoryReservations";
import LoadingPage from "@/components/LoadingPage";
import { useReservation } from "@/hooks/user-reservation-of-users";
import { useUserStore } from "@/store";
import { Reservation } from "@/utils";
import React, { useEffect, useState } from "react";

const ReservationPage: React.FC = () => {
  const { user } = useUserStore();

  const [allReservations, setAllReservations] = useState<Set<Reservation>>(
    new Set()
  );

  const { data, isLoading, isError } = useReservation(user?.id!);

  useEffect(() => {
    if (data && data.currentReservations) {
      setAllReservations((prev) => {
        const newSet = new Set(prev);
        data.currentReservations.forEach((reservation: Reservation) =>
          newSet.add(reservation)
        );
        return newSet;
      });
    }

    if (data && data.historyReservations) {
      setAllReservations((prev) => {
        const newSet = new Set(prev);
        data.historyReservations.forEach((reservation: Reservation) =>
          newSet.add(reservation)
        );
        return newSet;
      });
    }
  }, [data]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="w-full h-fit container p-4 flex flex-col lg:gap-6 gap-4 md:py-4">
      <div
        className="flex flex-col relative lg:justify-start justify-center lg:text-left
       text-center lg:px-2"
      >
        <h1 className="lg:text-2xl text-xl font-bold">Your Reservations</h1>

        <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
          Review and manage your reservations with ease.
        </p>
      </div>

      <div
        className="shadow-custom dark:border-white/20 border border-transparent
       p-4 md:w-[60%] w-full mx-auto rounded-2xl"
      >
        <h1 className="text-center lg:text-2xl text-xl font-medium">
          Make A Reservation
        </h1>

        <ReservationForm />
      </div>

      <CurrentReservations />
      <HistoryReservations />

      {allReservations.size !== 0 && (
        <FeedbackReservations
          reservations={Array.from(allReservations).map(
            (reservation) => reservation.id
          )}
        />
      )}
    </div>
  );
};

export default ReservationPage;
