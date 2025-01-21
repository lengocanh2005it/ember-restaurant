import { fetchTablesByTypes } from "@/api/tables/fetch-tables-with-types";
import { showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFindTablesByTypes = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: fetchTablesByTypes,
    onSuccess: (data: any) => {
      query.setQueryData(["tables"], data);
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
