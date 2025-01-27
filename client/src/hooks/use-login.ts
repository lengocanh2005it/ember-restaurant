import { handleLogin } from "@/api/login/login";
import { useAppStore } from "@/store";
import { showErrorToast } from "@/utils";
import { connectSocket } from "@/utils/socket";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const { setAccessToken } = useAppStore();

  return useMutation({
    mutationFn: handleLogin,
    onSuccess: async (data: any) => {
      const accessToken = data.accessToken;

      if (!accessToken) {
        console.error("Access Token is missing or invalid!");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      if (accessToken) {
        setAccessToken(accessToken);

        // connect to socket
        connectSocket(accessToken);
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
