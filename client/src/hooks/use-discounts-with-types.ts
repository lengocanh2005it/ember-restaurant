import { handleFetchDiscountsByType } from "@/api/discounts/fetch-discounts-by-types";
import { showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDiscountsByTypes = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleFetchDiscountsByType,
    onSuccess: (data: any) => {
      query.setQueryData(["discounts"], data);
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
