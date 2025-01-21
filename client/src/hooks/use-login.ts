import { handleLogin } from "@/api/login/login";
import { handleFetchProfileOfUser } from "@/api/users/fetch-profile-of-user";
import { useAppStore, useUserStore } from "@/store";
import { showErrorToast, User } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { setAccessToken, setIsDarkMode, setIsAdmin } = useAppStore();

  return useMutation({
    mutationFn: handleLogin,
    onSuccess: async (data: any) => {
      localStorage.setItem("accessToken", data.accessToken);
      if (localStorage.getItem("accessToken")) {
        setAccessToken(localStorage.getItem("accessToken") as string);
      }
      const user = (await handleFetchProfileOfUser()) as User;
      setUser(user);
      if (user) {
        setIsDarkMode(user.theme === "light" ? false : true);
        setIsAdmin(user.roles.some((role) => role === "admin"));
      }
      router.push("/home");
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast(err.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
