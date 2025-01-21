import { handleFetchTablesOfAreas } from "@/api/areas/fetch-tables-of-areas";
import { showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetAllTablesOfArea = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleFetchTablesOfAreas,
    onSuccess: (data: any) => {
      query.setQueryData(["new_tables"], data);
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
