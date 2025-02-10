import { handleFetchRequestsOfUser } from "@/api/users/fetch-requests-of-user";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useRequestsOfUser = (userId: string) => {
  return useQuery({
    queryKey: ["support-tickets", userId],
    queryFn: () => handleFetchRequestsOfUser(userId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
