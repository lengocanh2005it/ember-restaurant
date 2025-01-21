import { Product } from "@/utils";
import { create } from "zustand";

interface ProductState {
  product: Product | null;
  setProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  product: null,
  setProduct: (product) => set({ product }),
}));
