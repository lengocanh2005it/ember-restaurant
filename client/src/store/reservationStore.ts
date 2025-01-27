import { CreateReservationDto } from "@/api/reservation/utils/types";
import { Reservation } from "@/utils";
import { create } from "zustand";

interface ReservationState {
  reservationPayment: Reservation | null;
  reservationUpdate: Reservation | null;
  reservationData: CreateReservationDto | null;
  setReservationPayment: (reservationPayment: Reservation | null) => void;
  setReservationUpdate: (reservationUpdate: Reservation | null) => void;
  setReservationData: (reservationData: CreateReservationDto | null) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservationPayment: null,
  reservationUpdate: null,
  reservationData: null,
  setReservationPayment: (reservationPayment) => set({ reservationPayment }),
  setReservationUpdate: (reservationUpdate) => set({ reservationUpdate }),
  setReservationData: (reservationData) => set({ reservationData }),
}));
