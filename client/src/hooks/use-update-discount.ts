import { handleUpdateDiscount } from "@/api/discounts/update-discount";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateDiscount = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateDiscount,
    onSuccess: (data: any) => {
      query.setQueryData(["discounts"], data);
      showSuccessToast("Updated discount successfully!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
    },
    onError: (err: any) => {
      console.error(err);
      showErrorToast(
        "Updated discount failed. Please try again!",
        "bottom-right",
        {
          backgroundColor: "#dc3545",
          color: "#fff",
        }
      );
    },
  });
};
