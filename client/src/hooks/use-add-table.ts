import { handleCreateTable } from "@/api/tables/create-table";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddTable = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateTable,
    onSuccess: (data: any) => {
      query.setQueryData(["tables", userId], data);
      showSuccessToast("Added new table successfully!", "top-right", {
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
