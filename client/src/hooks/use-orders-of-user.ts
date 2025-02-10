import { handleFetchOrdersOfUsers } from "@/api/users/fetch-orders-of-user";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useOrder = (userId: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => handleFetchOrdersOfUsers(userId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
