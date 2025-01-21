import { handleDeleteReviewsOfProducts } from "@/api/products/delete-review-of-product";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteReviewOfProduct = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteReviewsOfProducts,
    onSuccess: (data: any) => {
      query.setQueryData(["product", data.data.id], data);
      showSuccessToast("Deleted feedback successfully!", "bottom-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast("Deleted event failed!", "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
