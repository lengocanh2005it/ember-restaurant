import { handleFetchReviews } from "@/api/reviews/fetch-reviews";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (isFeatured: string) => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => handleFetchReviews(isFeatured),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
