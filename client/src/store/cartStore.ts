import { Cart } from "@/utils";
import { create } from "zustand";

interface CartState {
  carts: Cart[];
  selectedCarts: Cart[];
  setCarts: (carts: Cart[]) => void;
  setSelectedCarts: (selectedCarts: Cart[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  carts: [],
  selectedCarts: [],
  setCarts: (carts) => set({ carts }),
  setSelectedCarts: (selectedCarts) => set({ selectedCarts }),
}));
