import { handleDeleteNotification } from "@/api/notifications/delete-notification";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteNotification = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteNotification,
    onSuccess: (data: any) => {
      query.setQueryData(["notifications"], data);
      showSuccessToast("Deleted notification successfully!", "bottom-right", {
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
