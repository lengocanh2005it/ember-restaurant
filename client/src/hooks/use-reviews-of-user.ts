import { handleFetchReviewsOfUser } from "@/api/users/fetch-reviews-of-user";
import { useQuery } from "@tanstack/react-query";

export const useReviewsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["reviews", userId],
    queryFn: () => handleFetchReviewsOfUser(userId),
    staleTime: 60 * 1000 * 15,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
