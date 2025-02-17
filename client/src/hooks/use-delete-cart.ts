import { handleDeleteCartOfUser } from "@/api/carts/delete-cart";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCart = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteCartOfUser,
    onSuccess: (data: any) => {
      console.log(data);
      query.setQueryData(["carts", userId], data.carts);
      query.setQueryData(["products"], data.products);
      showSuccessToast("Deleted the cart successfully!", "bottom-right", {
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
