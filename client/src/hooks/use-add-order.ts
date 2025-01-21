import { handleCreateOrder } from "@/api/orders/create-order";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddOrder = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateOrder,
    onSuccess: (data: any) => {
      query.setQueryData(["orders", userId], data.orders);
      query.setQueryData(["discounts", userId], data.discounts);
      showSuccessToast(
        "Create order successfully. Check in orders page.",
        "top-right",
        { backgroundColor: "#28a745", color: "#fff" }
      );
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast(err.response.data.message, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
