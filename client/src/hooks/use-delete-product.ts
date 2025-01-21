import { handleDeleteProduct } from "@/api/products/delete-product";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProduct = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteProduct,
    onSuccess: (data: any) => {
      query.setQueryData(["products"], data);
      showSuccessToast("Deleted product successfully.", "bottom-right", {
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
