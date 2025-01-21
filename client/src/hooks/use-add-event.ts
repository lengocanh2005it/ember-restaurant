import { handleCreateEvent } from "@/api/events/create-event";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddEvent = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateEvent,
    onSuccess: (data: any) => {
      query.setQueryData(["events"], data);
      showSuccessToast("Created event successfully!", "bottom-right", {
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
