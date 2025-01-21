import FeedbackReservationForm from "@/components/form/FeedbackReservationForm";
import React from "react";

interface FeedbackReservationsProps {
  reservations: string[];
}

const FeedbackReservations: React.FC<FeedbackReservationsProps> = ({
  reservations,
}) => {
  return (
    <div
      className="relative container mx-auto flex flex-col gap-2 items-center justify-center
    p-4 rounded-xl border dark:border-white/30 shadow-custom lg:w-[45%] w-full"
    >
      <div className="relative flex flex-col items-center text-center">
        <h1 className="lg:text-2xl text-xl font-bold">Reservation Feedback</h1>

        <p
          className="lg:text-base text-[14px] dark:text-white/70
         text-black/70"
        >
          Please leave your feedback about your reservations.
        </p>
      </div>

      <FeedbackReservationForm reservations={reservations} />
    </div>
  );
};

export default FeedbackReservations;
