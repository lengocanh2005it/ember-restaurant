import { handleSwitchTheme } from "@/lib/theme";
import { useAppStore, useUserStore } from "@/store";
import { User } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSwitchTheme = () => {
  const { setUser } = useUserStore();
  const { setIsDarkMode, setTheme } = useAppStore();
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleSwitchTheme,
    onSuccess: (data: any) => {
      if (data) {
        const user = data as User;

        query.setQueryData(["profile"], user);
        setUser(user);
        setIsDarkMode(user.theme === "light" ? false : true);
        setTheme(user.theme);
      }
    },
    onError: (err: any) => {
      console.error(err);
    },
  });
};
