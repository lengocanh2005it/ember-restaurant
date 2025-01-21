import { handleDeleteEvent } from "@/api/events/delete-event";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteEvent = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteEvent,
    onSuccess: (data: any) => {
      query.setQueryData(["events"], data);
      showSuccessToast("Deleted event successfully!", "bottom-right", {
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
