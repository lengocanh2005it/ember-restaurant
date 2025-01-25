import { CreateOrderDetailsDto } from "@/api/orders/utils/types";
import { Order } from "@/utils";
import { create } from "zustand";

interface OrderState {
  orderPayment: Order | null;
  orderUpdate: Order | null;
  orderData: CreateOrderDetailsDto | null;
  order: Order | null;
  setOrderPayment: (orderPayment: Order | null) => void;
  setOrderUpdate: (orderUpdate: Order | null) => void;
  setOrder: (order: Order | null) => void;
  setOrderData: (orderData: CreateOrderDetailsDto | null) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orderPayment: null,
  orderUpdate: null,
  order: null,
  orderData: null,
  setOrderPayment: (orderPayment) => set({ orderPayment }),
  setOrderUpdate: (orderUpdate) => set({ orderUpdate }),
  setOrder: (order) => set({ order }),
  setOrderData: (orderData) => set({ orderData }),
}));
