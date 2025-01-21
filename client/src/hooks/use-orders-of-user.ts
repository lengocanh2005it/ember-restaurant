import { handleFetchOrdersOfUsers } from "@/api/users/fetch-orders-of-user";
import { useQuery } from "@tanstack/react-query";

export const useOrder = (userId: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => handleFetchOrdersOfUsers(userId),
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
