import { handleFetchCartsOfUser } from "@/api/users/fetch-carts-of-user";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useCart = (userId: string) => {
  return useQuery({
    queryKey: ["carts", userId],
    queryFn: () => handleFetchCartsOfUser(userId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
