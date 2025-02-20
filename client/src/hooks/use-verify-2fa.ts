import { handleVerify2FaOfUser } from "@/api/users/verify-2fa-user";
import { useAppStore, useUserStore } from "@/store";
import { showErrorToast, showSuccessToast, User } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVerify2Fa = () => {
  const { setIsModalQRShow, setIsEnabled } = useAppStore();
  const { setUser } = useUserStore();
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleVerify2FaOfUser,
    onSuccess: (data: any) => {
      if (data) {
        setIsModalQRShow(false);
        setUser(data as User);
        query.setQueryData(["profile"], data);
        setIsEnabled(true);
        showSuccessToast("You have successfully enabled 2FA!", "top-right", {
          backgroundColor: "#28a745",
          color: "#fff",
        });
      }
    },
    onError: (error: any) => {
      console.error(error);
      showErrorToast(error.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
