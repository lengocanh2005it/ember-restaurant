import { handleReOrder } from "@/api/orders/re_create-order";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReOrder = (userId: string) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleReOrder,
    onSuccess: (data: any) => {
      query.setQueryData(["orders", userId], data);
      showSuccessToast("Re order successfully!", "top-right", {
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
      throw error;
    },
  });
};
