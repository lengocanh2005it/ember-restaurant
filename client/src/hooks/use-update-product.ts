import { handleUpdateProduct } from "@/api/products/update-product";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProduct = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleUpdateProduct,
    onSuccess: (data: any) => {
      query.setQueryData(["products"], data);
      showSuccessToast("Update dish successfully!", "top-right", {
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
