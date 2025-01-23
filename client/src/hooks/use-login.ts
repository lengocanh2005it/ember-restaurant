import { handleLogin } from "@/api/login/login";
import { useAppStore } from "@/store";
import { showErrorToast } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const { setAccessToken } = useAppStore();

  return useMutation({
    mutationFn: handleLogin,
    onSuccess: async (data: any) => {
      localStorage.setItem("accessToken", data.accessToken);
      if (localStorage.getItem("accessToken")) {
        setAccessToken(localStorage.getItem("accessToken") as string);
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
