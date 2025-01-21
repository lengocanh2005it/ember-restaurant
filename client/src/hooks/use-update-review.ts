import { handleUpdateReview } from "@/api/reviews/update-review";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateReviews = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleUpdateReview,
    onSuccess: (data: any) => {
      query.setQueryData(["reviews"], data);
      showSuccessToast(
        "Successfully! Please go to HOME PAGE to see latest updated!",
        "top-right",
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
