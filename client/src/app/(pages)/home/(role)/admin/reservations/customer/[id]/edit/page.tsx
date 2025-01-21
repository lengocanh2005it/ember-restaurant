"use client";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import EditReservationForm from "@/components/form/EditReservationForm";
import { Reservation } from "@/utils";
import { useUserStore } from "@/store";

const EditReservationPage: React.FC = () => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const { user } = useUserStore();
  const query = useQueryClient();

  const cachedData = query.getQueryData(["reservation", user?.id]);

  useEffect(() => {
    if (cachedData) {
      setReservation(cachedData as Reservation);
    }
  }, [cachedData]);

  return (
    <>
      {reservation ? (
        <div className="container mx-auto px-4 py-6 relative w-full flex flex-col lg:gap-6 gap-4">
          <div
            className="flex flex-col lg:items-start items-center lg:justify-start justify-center
          lg:text-left text-center"
          >
            <h1 className="lg:text-xl text-base uppercase font-bold">
              Edit Reservation Of Customer
            </h1>

            <p className="lg:text-base text-[14px] dark:text-white/70 text-black/70">
              Below this is a form to edit the reservation of customer.
            </p>
          </div>

          <EditReservationForm reservation={reservation} />
        </div>
      ) : (
        <p className="lg:text-xl text-base uppercase font-bold">
          Error when fetching reservation.
        </p>
      )}
    </>
  );
};

export default EditReservationPage;
