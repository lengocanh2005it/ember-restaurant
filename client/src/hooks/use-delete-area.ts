import { handleDeleteArea } from "@/api/areas/delete-area";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteArea = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteArea,
    onSuccess: (data: any) => {
      query.setQueryData(["areas"], data);
      showSuccessToast("Deleted a cart successfully!", "bottom-right", {
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
