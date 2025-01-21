import { handleCreateSupportTicket } from "@/api/support-ticket/create-support-ticket";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddSupportTicket = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateSupportTicket,
    onSuccess: (data: any) => {
      query.setQueryData(["profile"], data);
      showSuccessToast(
        "Thank you for your request. We will get back to you as soon as possible!",
        "bottom-right",
        {
          backgroundColor: "#28a745",
          color: "#fff",
        }
      );
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
