import { handleUpdateSupportTicket } from "@/api/support-ticket/update-support-ticket";
import { showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateRequest = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateSupportTicket,
    onSuccess: (data: any) => {
      query.setQueryData(["profile"], data.profile);
      query.setQueryData(["support-tickets", userId], data.support_tickets);
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
