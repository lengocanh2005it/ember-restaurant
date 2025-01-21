import { handleFetchPromotions } from "@/api/promotions/fetch-promotions";
import { useQuery } from "@tanstack/react-query";

export const usePromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: handleFetchPromotions,
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
