import { handleUpdateOrder } from "@/api/orders/update-order";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateOrder = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateOrder,
    onSuccess: (data: any) => {
      showSuccessToast("Order has been updated!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
      query.setQueryData(["orders", userId], data);
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast(err.response.data.message, "top-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
