import { handleFetchDiscountOfUser } from "@/api/users/fetch-discounts-of-user";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useDiscount = (userId: string) => {
  return useQuery({
    queryKey: ["discounts", userId],
    queryFn: () => handleFetchDiscountOfUser(userId),
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
