import { handleCreatePayment } from "@/api/payments/create-payment";
import { showSuccessToast, showErrorToast, Order } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePayment = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreatePayment,
    onSuccess: async (data: any) => {
      query.setQueryData(["orders", userId], data.orders);
      query.setQueryData(["reservations", userId], data.reservations);
      query.setQueryData(["profile"], data.profile);
      query.setQueryData(["discounts", userId], data.discounts);
      showSuccessToast("Payment successful!", "bottom-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast("Payment failed!", "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
