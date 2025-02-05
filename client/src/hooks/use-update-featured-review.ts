import { handleUpdateFeaturedReviews } from "@/api/reviews/update-featured-review";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateFeaturedReviews = (userId: string) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleUpdateFeaturedReviews,
    onSuccess: (data: any) => {
      query.setQueryData(["reviews", userId], data.reviews_user);
      query.setQueryData(["reviews"], data.reviews);
      showSuccessToast(
        "Updated the review of user successfully!",
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
