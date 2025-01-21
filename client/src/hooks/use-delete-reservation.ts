import { handleDeleteReservation } from "@/api/reservation/delete-reservation";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteReservation = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteReservation,
    onSuccess: (data: any) => {
      query.setQueryData(["reservations", userId], data.reservations);
      showSuccessToast("Deleted reservation successfully!", "bottom-right", {
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
