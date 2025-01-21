import { handleFetchReviews } from "@/api/reviews/fetch-reviews";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (isFeatured: string) => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => handleFetchReviews(isFeatured),
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
