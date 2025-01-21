import { handleUpdateProfileOfUser } from "@/api/users/update-profile-of-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfileCustomer = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: handleUpdateProfileOfUser,
    onSuccess: (data: any) => {
      query.setQueryData(["customers"], data);
    },
    onError: (err: any) => {
      console.error(err);
    },
  });
};
