import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteSupportTicket } from "@/api/support-ticket/delete-support-ticket";
import { showSuccessToast, showErrorToast } from "@/utils";

export const useDeleteSupportTicket = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteSupportTicket,

    onSuccess: (data: any) => {
      query.setQueryData(["profile"], data);
      showSuccessToast("Deleted your request successfully!", "bottom-right", {
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
