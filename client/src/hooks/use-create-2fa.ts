import { handleCreate2FAOfUser } from "@/api/users/create-2fa-user";
import { useAppStore, useUserStore } from "@/store";
import { User } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreate2FA = () => {
  const { setIsModalQRShow } = useAppStore();
  const { setUser } = useUserStore();
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreate2FAOfUser,
    onSuccess: (data: any) => {
      if (data && data.qrCodeImage) {
        query.setQueryData(["google-authenticator"], data.qrCodeImage);
        setIsModalQRShow(true);
      } else if (data && data.profile) {
        query.setQueryData(["profile"], data.profile);
        setUser(data.profile as User);
        setIsModalQRShow(false);
      }
    },
    onError: (err: any) => {
      console.error(err);
    },
  });
};
