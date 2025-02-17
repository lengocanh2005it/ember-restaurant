import { handleUpdateCart } from "@/api/carts/update-cart";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCart = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateCart,
    onSuccess: (data: any) => {
      query.setQueryData(["carts", userId], data.carts);
      query.setQueryData(["products"], data.products);
      showSuccessToast("Updated the cart successfully!", "top-right", {
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
