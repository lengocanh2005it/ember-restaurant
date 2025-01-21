import { handleDeleteDiscount } from "@/api/discounts/delete-discount";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteDiscount = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteDiscount,
    onSuccess: (data: any) => {
      query.setQueryData(["discounts"], data);
      showSuccessToast("Deleted notification successfully!", "bottom-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
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
