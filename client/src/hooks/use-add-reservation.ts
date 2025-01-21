import { handleCreateReservation } from "@/api/reservation/create-reservation";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddReservation = (userId: string) => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleCreateReservation,
    onSuccess: (data: any) => {
      query.setQueryData(["reservations", userId], data.reservations);
      showSuccessToast("Add new reservation successfully!", "top-right", {
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
