import { handleFetchRequestsOfUser } from "@/api/users/fetch-requests-of-user";
import { useQuery } from "@tanstack/react-query";

export const useRequestsOfUser = (userId: string) => {
  return useQuery({
    queryKey: ["support-tickets", userId],
    queryFn: () => handleFetchRequestsOfUser(userId),
    staleTime: 1000 * 60 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
