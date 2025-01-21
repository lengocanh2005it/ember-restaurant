import { handleUpdateTable } from "@/api/tables/update-table";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTable = (areaId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateTable,
    onSuccess: (data: any) => {
      query.setQueryData(["area", areaId], data);
      showSuccessToast("Updated table successfully!", "top-right", {
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
