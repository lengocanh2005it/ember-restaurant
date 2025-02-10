import { handleFetchDiscounts } from "@/api/discounts/fetch-discounts";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useDiscounts = () => {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: handleFetchDiscounts,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
