import { handleCreatePromotion } from "@/api/promotions/create-promotion";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddPromotion = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleCreatePromotion,
    onSuccess: (data: any) => {
      query.setQueryData(["promotions"], data);
      showSuccessToast("Added promotion successfully!", "top-right", {
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
