import { handleUpdatePromotion } from "@/api/promotions/update-promotion";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleUpdatePromotion,
    onSuccess: (data: any) => {
      queryClient.setQueryData(["promotions"], data);

      showSuccessToast("Updated promotion successfully!", "top-right", {
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
