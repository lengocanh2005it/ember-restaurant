import { handleRedeemPoint } from "@/api/point/redeem-point";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRedeemPoint = (userId: string) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleRedeemPoint,
    onSuccess: (data: any) => {
      query.setQueryData(["discounts", userId], data.discounts);
      query.setQueryData(["profile"], data.profile);
      showSuccessToast("Redeem point successfully!", "bottom-right", {
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
