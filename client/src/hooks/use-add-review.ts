import { handleCreateReview } from "@/api/reviews/create-review";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddReview = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateReview,
    onSuccess: (data: any) => {
      query.setQueryData(["products"], data.products);

      showSuccessToast("We appreciate your feedback!", "bottom-right", {
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
