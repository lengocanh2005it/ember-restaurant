import { Promotion } from "@/utils";
import { create } from "zustand";

interface PromotionState {
  promotions: Promotion[];
  setPromotions: (promotion: Promotion[]) => void;
}

export const usePromotionStore = create<PromotionState>((set) => ({
  promotions: [],
  setPromotions: (promotions) => set({ promotions }),
}));
