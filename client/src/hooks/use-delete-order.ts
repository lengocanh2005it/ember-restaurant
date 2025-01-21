import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteOrder } from "@/api/orders/delete-order";
import { showSuccessToast, showErrorToast } from "@/utils";

export const useDeleteOrder = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteOrder,
    onSuccess: (data: any) => {
      query.setQueryData(["orders", userId], data);
      showSuccessToast(
        "Your order has been deleted successfully!",
        "bottom-right",
        { backgroundColor: "#28a745", color: "#fff" }
      );
    },
    onError: (err) => {
      console.error(err);
      showErrorToast("Delete reservation failed!", "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
