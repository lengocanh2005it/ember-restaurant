import { handleCreateNotification } from "@/api/notifications/create-notification";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddNotification = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateNotification,
    onSuccess: (data: any) => {
      query.setQueryData(["notifications"], data);
      showSuccessToast("Add a new notification successfully!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
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
