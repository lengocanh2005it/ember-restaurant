"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import TableOfReservations from "@/components/TableOfReservations";
import { useReservation } from "@/hooks/user-reservation-of-users";
import { User, Reservation } from "@/utils";

const ListReservationsOfCustomer: React.FC = () => {
  const params = useParams();
  const query = useQueryClient();

  const [customer, setCustomer] = useState<User | null>(null);

  const { data: reservationData, isLoading } = useReservation(
    params.id! as string
  );

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const cachedData = query.getQueryData(["customerProfile"]) as User;

  useEffect(() => {
    if (cachedData) {
      setCustomer(cachedData as User);
    }
  }, [cachedData]);

  useEffect(() => {
    if (reservationData && reservationData.historyReservations) {
      setReservations(reservationData.historyReservations as Reservation[]);
    }
  }, [reservationData]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <main
      className="w-full mx-auto lg:px-4 py-6 flex flex-col gap-4 lg:justify-start lg:items-start
    justify-center items-center"
    >
      <div
        className="flex lg:flex-row flex-col items-center lg:justify-start
      justify-center lg:gap-2 gap-1 lg:px-10"
      >
        <div
          className="relative w-[55px] h-[55px] rounded-full lg:items-start items-center lg:justify-start
        justify-center"
        >
          {customer?.image && customer.image && (
            <Image
              src={customer.image}
              alt="avatar"
              priority
              sizes="(max-width: 600px) 100vw, 50vw"
              fill
              className="cursor-pointer select-none object-cover rounded-full"
            />
          )}
        </div>

        <div className="flex flex-col lg:text-left text-center">
          <h1 className="lg:text-base text-lg font-bold">
            {customer?.name ? customer.name : customer?.username}
          </h1>
          <p className="lg:text-[14px] text-[16px] dark:text-white/70 text-black/80">
            {customer?.phone
              ? "Phone number: " + customer.phone
              : "Phone: Null"}
          </p>
        </div>
      </div>

      <TableOfReservations reservations={reservations} />
    </main>
  );
};

export default ListReservationsOfCustomer;
