import { handleAddProduct } from "@/api/products/create-product";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddProduct = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleAddProduct,
    onSuccess: (data: any) => {
      query.setQueryData(["products"], data);
      showSuccessToast("Added dish to menu successfully!", "top-right", {
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
