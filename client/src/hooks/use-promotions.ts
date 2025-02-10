import { handleFetchPromotions } from "@/api/promotions/fetch-promotions";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const usePromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: handleFetchPromotions,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
