import { handleFetchDiscountOfUser } from "@/api/users/fetch-discounts-of-user";
import { useQuery } from "@tanstack/react-query";

export const useDiscount = (userId: string) => {
  return useQuery({
    queryKey: ["discounts", userId],
    queryFn: () => handleFetchDiscountOfUser(userId),
    staleTime: 60 * 1000 * 20,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
