import { handleUpdateArea } from "@/api/areas/update-area";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateArea = (areaId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateArea,
    onSuccess: (data: any) => {
      query.setQueryData(["areas"], data.areas);
      query.setQueryData(["area", areaId], data.area);
      showSuccessToast("Updated the area successfully!", "top-right", {
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
