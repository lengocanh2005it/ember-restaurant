import { handleConfirm2FA } from "@/api/users/confirm-2fa-user";
import { handleCreate2FAOfUser } from "@/api/users/create-2fa-user";
import { useAppStore } from "@/store";
import { showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConfirm2FA = () => {
  const { setIsModalQRShow, setIsRegistered } = useAppStore();
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleConfirm2FA,
    onSuccess: async (data: any) => {
      if (data && data.success === true) {
        const response = await handleCreate2FAOfUser({
          type: "generate",
        });

        if (response && response.qrCodeImage) {
          query.setQueryData(["google-authenticator"], response.qrCodeImage);
          setIsModalQRShow(true);
          setIsRegistered(false);
        }
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
