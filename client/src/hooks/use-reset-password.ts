import { useMutation } from "@tanstack/react-query";
import {
  handleResetPassword,
  handleSendEmail,
} from "@/api/reset-password/reset-password";
import { showSuccessToast, showErrorToast } from "@/utils";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: handleResetPassword,
    onSuccess: (data: any) => {
      showSuccessToast("Your password has been changed!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
    },
    onError: (error: any) => {
      showErrorToast(error.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
      console.error(error);
    },
  });
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: handleSendEmail,
    onSuccess: (data: any) => {
      showSuccessToast(
        "Check your email to reset your password!",
        "bottom-right",
        {
          backgroundColor: "#28a745",
          color: "#fff",
        }
      );
    },
    onError: (err: any) => {
      showErrorToast(err.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
      console.error(err);
    },
  });
};
