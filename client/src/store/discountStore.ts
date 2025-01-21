import { DiscountWithQuantity } from "@/utils";
import { create } from "zustand";

interface DiscountState {
  discount: DiscountWithQuantity | null;
  setDiscount: (discount: DiscountWithQuantity | null) => void;
}

export const useDiscountStore = create<DiscountState>((set) => ({
  discount: null,
  setDiscount: (discount) => set({ discount }),
}));
