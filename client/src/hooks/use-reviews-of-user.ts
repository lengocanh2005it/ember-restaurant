import { handleFetchReviewsOfUser } from "@/api/users/fetch-reviews-of-user";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useReviewsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["reviews", userId],
    queryFn: () => handleFetchReviewsOfUser(userId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
