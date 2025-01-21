import { handleUpdateEvent } from "@/api/events/update-event";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEvent = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateEvent,
    onSuccess: (data: any) => {
      query.setQueryData(["events"], data);

      showSuccessToast("Updated event successfully!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast(
        "Updated notification failed. Please try again!",
        "bottom-right",
        {
          backgroundColor: "#dc3545",
          color: "#fff",
        }
      );
    },
  });
};
