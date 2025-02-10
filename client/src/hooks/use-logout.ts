import { handleLogout } from "@/api/logout/logout";
import { useAppStore } from "@/store";
import { disconnectSocket } from "@/utils/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const query = useQueryClient();
  const { setTheme } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: handleLogout,
    onSuccess: async (data: any) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("app-storage");
      localStorage.removeItem("user-storage");

      // disconnect to websocket
      disconnectSocket();

      setTimeout(() => {
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }, 800);
      query.clear();
      router.push("/login");
    },
    onError: (err: any) => {
      console.error(err);
    },
  });
};
