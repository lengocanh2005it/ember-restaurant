import { handleUpdateEmail } from "@/api/users/update-email-of-user";
import { useAppStore } from "@/store";
import { showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEmail = () => {
  const query = useQueryClient();
  const { setIsExistedEmail } = useAppStore();

  return useMutation({
    mutationFn: handleUpdateEmail,
    onSuccess: (data: any) => {
      if (data.statusCode === 200) {
        query.setQueryData(["isVerifyEmail"], false);
        setIsExistedEmail(false);
      } else if (data.statusCode === 201) {
        query.setQueryData(["isVerifyEmail"], true);
        setIsExistedEmail(false);
      } else if (data.statusCode === 400) {
        setIsExistedEmail(true);
        query.setQueryData(["isVerifyEmail"], false);
        showErrorToast(
          "This email has been used by another user.",
          "bottom-right",
          {
            backgroundColor: "#dc3545",
            color: "#fff",
          }
        );
      }
    },
    onError: (error: any) => {
      console.error(error);
      setIsExistedEmail(true);
      showErrorToast(error.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
