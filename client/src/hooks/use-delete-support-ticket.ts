import { handleDeleteSupportTicket } from "@/api/support-ticket/delete-support-ticket";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteSupportTicket = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteSupportTicket,
    onSuccess: (data: any) => {
      query.setQueryData(["support-tickets", userId], data.support_tickets);
      query.setQueryData(["support-tickets"], data.support_tickets);
      showSuccessToast("Request deleted successfully!", "bottom-right", {
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
