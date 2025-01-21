import { Reservation, ReservationPayment } from "@/utils";
import { create } from "zustand";

interface ReservationState {
  reservationPayment: ReservationPayment | null;
  reservationUpdate: Reservation | null;
  setReservationPayment: (
    reservationPayment: ReservationPayment | null
  ) => void;
  setReservationUpdate: (reservationUpdate: Reservation | null) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservationPayment: null,
  reservationUpdate: null,
  setReservationPayment: (reservationPayment) => set({ reservationPayment }),
  setReservationUpdate: (reservationUpdate) => set({ reservationUpdate }),
}));
