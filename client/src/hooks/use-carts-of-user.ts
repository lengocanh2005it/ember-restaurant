import { handleFetchCartsOfUser } from "@/api/users/fetch-carts-of-user";
import { useQuery } from "@tanstack/react-query";

export const useCart = (userId: string) => {
  return useQuery({
    queryKey: ["carts", userId],
    queryFn: () => handleFetchCartsOfUser(userId),
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
