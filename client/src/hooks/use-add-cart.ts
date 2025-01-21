import { handleCreateCart } from "@/api/carts/create-cart";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddCart = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateCart,
    onSuccess: (data: any) => {
      query.setQueryData(["carts", userId], data);
      query.setQueryData(["products"], data.products);
      showSuccessToast("Added product to cart successfully!", "top-right", {
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
