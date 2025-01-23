import { handleDeleteSupportTicket } from "@/api/support-ticket/delete-support-ticket";
import { useUserStore } from "@/store";
import { showErrorToast, showSuccessToast, User } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteSupportTicket = () => {
  const query = useQueryClient();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: handleDeleteSupportTicket,
    onSuccess: (data: any) => {
      query.setQueryData(["profile"], data.support_tickets_user);
      if (data?.support_tickets_user) {
        setUser(data.support_tickets_user as User);
      }
      query.setQueryData(["support-tickets"], data.support_tickets);
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
