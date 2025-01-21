import { handleVerifyEmail } from "@/api/users/verify-email-of-user";
import { showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVerifyEmail = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleVerifyEmail,
    onSuccess: (data: any) => {
      query.setQueryData(["isVerified"], true);
    },
    onError: (err: any) => {
      query.setQueryData(["isVerified"], false);
      showErrorToast(
        "Wrong verification code. Please check again!",
        "bottom-right",
        {
          backgroundColor: "#dc3545",
          color: "#fff",
        }
      );
    },
  });
};
