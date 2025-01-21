import { create } from "zustand";

interface AppState {
  isClose: boolean;
  setIsClose: (isClose: boolean) => void;
  category: string;
  setCategory: (category: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  otp: string;
  setOTP: (otp: string) => void;
  isExistedEmail: boolean;
  setIsExistedEmail: (isExistedEmail: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAdmin: false,
  isClose: true,
  category: "all",
  theme: "dark",
  accessToken: "",
  isDarkMode: true,
  otp: "",
  isExistedEmail: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  setCategory: (category) => set({ category }),
  setIsClose: (isClose) => set({ isClose }),
  setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setOTP: (otp) => set({ otp }),
  setIsExistedEmail: (isExistedEmail) => set({ isExistedEmail }),
  setTheme: (theme) => set({ theme }),
}));
