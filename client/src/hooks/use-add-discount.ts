import { handleCreateDiscount } from "@/api/discounts/create-discount";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddDiscount = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleCreateDiscount,
    onSuccess: (data: any) => {
      query.setQueryData(["discounts"], data);
      showSuccessToast("Created discount successfully!", "bottom-right", {
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
