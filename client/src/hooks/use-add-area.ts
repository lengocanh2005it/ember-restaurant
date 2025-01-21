import { handleCreateArea } from "@/api/areas/create-area";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddArea = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateArea,
    onSuccess: (data: any) => {
      query.setQueryData(["areas"], data);
      showSuccessToast("Added new area successfully!", "top-right", {
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
