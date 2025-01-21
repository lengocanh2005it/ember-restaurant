import { handleDeleteUser } from "@/api/users/delete-user";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCustomer = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleDeleteUser,
    onSuccess: (data: any) => {
      query.setQueryData(["customers"], data);
      showSuccessToast("Deleted user successfully.", "bottom-right", {
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
