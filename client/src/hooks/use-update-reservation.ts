import { handleUpdateReservation } from "@/api/reservation/update-reservation";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateReservation = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleUpdateReservation,
    onSuccess: (data: any) => {
      query.setQueryData(["reservations", userId], data.reservations);
      showSuccessToast("Update reservation successfully!", "top-right", {
        backgroundColor: "#28a745",
        color: "#fff",
      });
    },
    onError: (error: any) => {
      console.error(error);
      showErrorToast(error.response.data.message as string, "bottom-right", {
        backgroundColor: "#dc3545",
        color: "#fff",
      });
    },
  });
};
