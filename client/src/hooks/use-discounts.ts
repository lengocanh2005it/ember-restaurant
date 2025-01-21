import { handleFetchDiscounts } from "@/api/discounts/fetch-discounts";
import { useQuery } from "@tanstack/react-query";

export const useDiscounts = () => {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: handleFetchDiscounts,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000 * 20,
  });
};
