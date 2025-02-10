import { handleLogin } from "@/api/login/login";
import { showErrorToast } from "@/utils";
import { connectSocket } from "@/utils/socket";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: handleLogin,
    onSuccess: async (data: any) => {
      const accessToken = data.accessToken;

      connectSocket(accessToken);

      router.replace("/home");
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
