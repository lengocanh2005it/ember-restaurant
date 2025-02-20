import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  type: string;
  setType: (type: string) => void;
  isModalQRShow: boolean;
  setIsModalQRShow: (isModalQRShow: boolean) => void;
  isEnabled: boolean;
  setIsEnabled: (isEnabled: boolean) => void;
  isRegistered: boolean;
  setIsRegistered: (isRegistered: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAdmin: false,
      isClose: true,
      category: "all",
      theme: "dark",
      accessToken: "",
      isDarkMode: true,
      otp: "",
      isExistedEmail: false,
      type: "",
      isModalQRShow: false,
      isEnabled: false,
      isRegistered: false,
      setAccessToken: (accessToken) => set({ accessToken }),
      setCategory: (category) => set({ category }),
      setIsClose: (isClose) => set({ isClose }),
      setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setOTP: (otp) => set({ otp }),
      setIsExistedEmail: (isExistedEmail) => set({ isExistedEmail }),
      setTheme: (theme) => set({ theme }),
      setType: (type) => set({ type }),
      setIsModalQRShow: (isModalQRShow) => set({ isModalQRShow }),
      setIsEnabled: (isEnabled: boolean) => set({ isEnabled }),
      setIsRegistered: (isRegistered: boolean) => set({ isRegistered }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        isAdmin: state.isAdmin,
        isClose: state.isClose,
        category: state.category,
        theme: state.theme,
        accessToken: state.accessToken,
        isDarkMode: state.isDarkMode,
        otp: state.otp,
        isExistedEmail: state.isExistedEmail,
        isEnabled: state.isEnabled,
        isModalQRShow: state.isModalQRShow,
      }),
    }
  )
);
