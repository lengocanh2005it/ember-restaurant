import { handleUpdateNotification } from "@/api/notifications/update-notification";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateNotification = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleUpdateNotification,
    onSuccess: (data: any) => {
      query.setQueryData(["notifications"], data);

      showSuccessToast("Update notification successfully!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
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
