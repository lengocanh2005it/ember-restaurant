import { handleUpdatePasswordOfUser } from "@/api/users/update-password";
import { useLogout } from "@/hooks/use-logout";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation } from "@tanstack/react-query";

export const useUpdatePassword = () => {
  const { mutate: mutateLogout } = useLogout();

  return useMutation({
    mutationFn: handleUpdatePasswordOfUser,
    onSuccess: (data: any) => {
      if (data) {
        showSuccessToast("Password updated successfully!", "top-right", {
          backgroundColor: "#28a745",
          color: "#fff",
        });

        setTimeout(() => {
          mutateLogout();
        }, 1200);
      }
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
