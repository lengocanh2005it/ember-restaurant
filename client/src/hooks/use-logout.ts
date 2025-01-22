import { handleLogout } from "@/api/logout/logout";
import { useAppStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const query = useQueryClient();
  const { setTheme } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: handleLogout,
    onSuccess: (data: any) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("app-storage");
      localStorage.removeItem("user-storage");
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
