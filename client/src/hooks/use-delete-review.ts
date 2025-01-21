import { handleDeleteReview } from "@/api/reviews/delete-review";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteReview = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteReview,
    onSuccess: (data: any) => {
      query.setQueryData(["reviews", userId], data);
      showSuccessToast("Deleted review successfully!", "bottom-right", {
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
