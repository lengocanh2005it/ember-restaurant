import { handleFetchUser } from "@/api/users/fetch-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCustomer = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: handleFetchUser,
    onSuccess: (data: any) => {
      query.setQueryData(["customer"], data.data);
    },
    onError: (err: any) => {
      console.error(err);
    },
  });
};
