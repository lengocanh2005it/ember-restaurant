import { handleDeleteTicketMessage } from "@/api/ticket-messages/delete-ticket-messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTicketMessage = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteTicketMessage,
    onSuccess: (data: any) => {
      if (data && data.support_tickets) {
        query.setQueryData(["support-tickets", userId], data.support_tickets);
        query.setQueryData(["support-tickets"], data.support_tickets);
      }
    },
    onError: (err: any) => {
      console.error(err);
    },
  });
};
