import { Notification } from "@/utils";
import { create } from "zustand";

interface NotificationState {
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notification: null,
  setNotification: (notification) => set({ notification }),
}));
