import { Order, OrderPayment } from "@/utils";
import { create } from "zustand";

interface OrderState {
  orderPayment: OrderPayment | null;
  orderUpdate: Order | null;
  setOrderPayment: (orderPayment: OrderPayment | null) => void;
  setOrderUpdate: (orderUpdate: Order | null) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orderPayment: null,
  orderUpdate: null,
  setOrderPayment: (orderPayment) => set({ orderPayment }),
  setOrderUpdate: (orderUpdate) => set({ orderUpdate }),
}));
