import { handleDeletePromotion } from "@/api/promotions/delete-promotion";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePromotion = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeletePromotion,
    onSuccess: (data: any) => {
      query.setQueryData(["promotions"], data);
      showSuccessToast("Deleted promotion successfully!", "bottom-right", {
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
